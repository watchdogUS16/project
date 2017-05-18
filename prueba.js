function addToArray (data) {
  const promise = new Promise(function (resolve, reject) {
    setTimeout(function() {
      console.log("primero");
    }, 1000);
  })
  return promise
}

addToArray(4).then(function () {
  console.log("segundo");
})
