class Cycled {
  constructor(inputArray) {
    this.currentArray = inputArray
    this.currentIndex = 0
  }

  current() {
    return this.currentArray[this.currentIndex]
  }

  next() {
    const arrayToBeModified = [...this.currentArray]
    const shiftedElement = arrayToBeModified.shift()
    arrayToBeModified.push(shiftedElement)
    this.currentArray = arrayToBeModified
    return this.current()
  }

  previous() {
    const arrayToBeModified = [...this.currentArray]
    const poppedElement = arrayToBeModified.pop()
    arrayToBeModified.unshift(poppedElement)
    this.currentArray = arrayToBeModified
    return this.current()
  }

  step(stepBy) {
    for (let i = 0; i < Math.abs(stepBy); i += 1) {
      if (stepBy > 0) {
        this.next()
      } else if (stepBy < 0) {
        this.previous()
      }
    }

    return this.current()
  }

  reversed() {
    const arrayToReverse = [...this.currentArray]
    return arrayToReverse.reverse()[Symbol.iterator]()
  }

  indexOf(element) {
    return this.currentArray.indexOf(element)
  }

  length() {
    return this.currentArray.length
  }

  get index() {
    return this.currentIndex
  }

  set index(indexValue) {
    if (this.currentArray[indexValue]) this.currentIndex = indexValue
  }

  [Symbol.iterator]() {
    let count = 0
    return {
      next: () => {
        if (count < this.currentArray.length) {
          const currentValue = this.currentArray[count]
          count += 1
          return {
            done: false,
            value: currentValue,
          }
        }
        return {
          done: true,
        }
      },
    }
  }
}

export { Cycled }
