const abbreviaNumero = (num) => {
  if (num >= 1000000) {
    const numInMillions = (num / 1000000).toFixed(1)
    return numInMillions.endsWith(".0") ? numInMillions.slice(0, -2) + "M" : numInMillions + "M"
  } else if (num >= 1000) {
    const numInThousands = (num / 1000).toFixed(1)
    return numInThousands.endsWith(".0") ? numInThousands.slice(0, -2) + "K" : numInThousands + "K"
  } else {
    return num.toString()
  }
}

export { abbreviaNumero }
