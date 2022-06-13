import interact from 'interact.js'

const onStart = (event) => {
  const { target } = event
  target.style.transition = 'none'
  target.setAttribute('data-x', null)
  target.setAttribute('data-y', null)
}

const onMove = (event) => {
  const { target } = event

  // keep the dragged position in the data-x/data-y attributes
  const [currentX, currentY] = target.style.transform.match(/-?[\d.]+/g)
  const x = (parseFloat(target.getAttribute('data-x')) || parseFloat(currentX) || 0) + event.dx
  const y = (parseFloat(target.getAttribute('data-y')) || parseFloat(currentY) || 0) + event.dy

  // translate the element
  const transform = `translate(${x}px, ${y}px)`
  target.style.webkitTransform = transform
  target.style.transform = transform

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

const setupDrag = (element, { dragArea }) => interact(element, {
  ignoreFrom: '.bar-container',
  styleCursor: false,
})
  .draggable({
    enabled: true,
    inertia: true,
    autoScroll: false,
    restrict: {
      restriction: dragArea,
      endOnly: true,
      elementRect: {
        top: 0, left: 0, bottom: 1, right: 1,
      },
    },
    onstart: onStart,
    onmove: onMove,
  })

const setupDrop = (element, { dropAreaElement, onDrop }) => {
  const elementSelector = '[data-player]'

  interact(dropAreaElement)
    .dropzone({
      accept: elementSelector,
      overlap: 0.75,
      ondrop: onDrop,
    })
}

const setupInteractions = (element, { drag, drop }) => {
  const result = {}
  if (drag) {
    result.drag = setupDrag(element, drag)
  }
  if (drop) {
    result.drag = setupDrop(element, drop)
  }
  return result
}

export default setupInteractions
