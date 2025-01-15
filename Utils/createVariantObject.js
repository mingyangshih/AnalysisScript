function createVariantObject(object, variant, defaultValue) {
  if (!object[variant]) {
    object[variant] = defaultValue;
  }
}

module.exports = {
  createVariantObject,
};
