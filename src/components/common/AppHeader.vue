<template>
  <header
    class="mb-8 flex flex-wrap items-center justify-between bg-white rounded-lg shadow-sm p-4 sm:p-5"
  >
    <div class="flex items-center w-full sm:w-auto">
      <div class="mr-3 sm:mr-4 text-indigo-600 flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 sm:h-10 sm:w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h1
        class="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 truncate"
      >
        Restaurant Reservation System
      </h1>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
@media (max-width: 640px) {
  .bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
  }
}
</style>
