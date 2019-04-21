export function waitForPromises(promises) {
  return new Promise(function(resolve, reject) {
    function reportPromise(p) {
      p.then(data => {
        result.push({ data, success: true });
        nextPromise();
      }).catch(error => {
        result.push({ error, failed: true });
        nextPromise();
      });
    }

    function nextPromise() {
      if (index === promises.length) {
        resolve(result);
      } else {
        let p = promises[index];
        index += 1;
        reportPromise(p);
      }
    }

    let result = [];
    let index = 0;
    nextPromise();
  });
}
