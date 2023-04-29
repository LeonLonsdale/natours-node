exports.capitaliseSlug = (string) => {
  const words = string.split('-');
  const capitalisedWords = words.map(
    (word) => word[0].toUpperCase() + word.substr(1)
  );
  return capitalisedWords.join(' ');
};
