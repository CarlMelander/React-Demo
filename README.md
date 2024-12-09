# React Demo: Prime Number Calculator Using Web Workers

This project demonstrates the use of React features alongside JavaScript's `Web Worker` API to efficiently calculate prime numbers using the Sieve of Eratosthenes algorithm. The computation is distributed among multiple web workers to maximize performance, particularly for large datasets.

## Features

- **React-based UI**: Provides a modern, interactive interface.
- **Efficient Prime Calculation**: Utilizes the Sieve of Eratosthenes algorithm for optimized performance.
- **Multi-threading**: Distributes computation using web workers to improve responsiveness by offloading work from the main thread.
- **Theming Support**: Implements light and dark themes for user preferences.
- **Dynamic Range Selection**: Users can define the upper limit for prime calculation.

## Project Structure

- **`App.tsx`**: The main React component controlling the user interface.
- **`primeWorker.js`**: A worker script to perform prime calculations in parallel.
- **`App.css`** and **`index.css`**: Style sheets for theming and responsive design.
- **`main.tsx`**: The entry point rendering the React application.

## How It Works

1. **User Input**: The user specifies the range for prime calculation.
2. **Worker Initialization**: The app initializes multiple web workers, distributing the task based on the range.
3. **Parallel Computation**: Each worker computes primes in its assigned range using the Sieve of Eratosthenes.
4. **Result Aggregation**: The main thread collects results from all workers and displays the final list of prime numbers.

## Usage

### Running the Project
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Interaction
- Enter the desired range for prime number calculation.
- View results dynamically updated in the interface.

## Key File Descriptions

### `primeWorker.js`
Contains the logic for prime number calculation. It divides the range into chunks and processes them concurrently in separate threads.

### `App.tsx`
Implements the user interface, managing state for the range, results, and worker coordination.

### `App.css` & `index.css`
Defines the styles for the application, including theming support.

## Dependencies

- **React**: Frontend framework for UI development.
- **Vite**: Development environment for faster builds.
- **TypeScript**: For type-safe coding.

## Future Enhancements

- Add custom themes for more personalization.
- Visualize prime calculations dynamically for educational purposes.
- Implement a settings panel to fine-tune worker behavior (e.g., thread count).

## Acknowledgements

This project uses the Sieve of Eratosthenes algorithm, a classic approach to efficiently finding prime numbers. The multi-threaded implementation showcases how modern web applications can handle computationally intensive tasks without blocking user interactions.
