// Helper function to calculate primes for a specific range
function calculatePrimesInRange(start, end, sieve) {
  for (let num = start; num < end; num++) {
    if (sieve[num]) {
      for (let multiple = num * num; multiple <= sieve.length - 1; multiple += num) {
        sieve[multiple] = false;
      }
    }
  }
  return sieve;
}

self.onmessage = function(e) {
  const { limit, workerNumber, totalWorkers } = e.data;
  
  // Initialize sieve
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  
  // Calculate chunk size and range for this worker
  const sqrtLimit = Math.sqrt(limit);
  const chunkSize = Math.ceil(sqrtLimit / totalWorkers);
  const start = workerNumber * chunkSize;
  const end = Math.min((workerNumber + 1) * chunkSize, sqrtLimit);
  
  // Calculate primes in this worker's range
  const updatedSieve = calculatePrimesInRange(start, end, sieve);
  
  // Send back results
  self.postMessage({
    sieve: updatedSieve,
    workerNumber: workerNumber
  });
};