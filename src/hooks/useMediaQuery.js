import { ref, watch } from 'vue';
const useMediaQuery = (query) => {
  const matches = ref(false);
  const mediaQuery = window.matchMedia(query);
  matches.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', function (e) {
    matches.value = e.matches;
  });
  return matches;
};

export default useMediaQuery;
