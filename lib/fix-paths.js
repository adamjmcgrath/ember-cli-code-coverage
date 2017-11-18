var existsSync = require('exists-sync');
var path = require('path');

function getPathForRealFile(relativePath, root, templateExtensions) {
  if (existsSync(path.join(root, relativePath))) {
    return relativePath
  }

  for (var i = 0, len = templateExtensions.length; i < len; i++) {
    var extension = templateExtensions[i];
    var templatePath = relativePath.replace('.js', '.' + extension);

    if (existsSync(templatePath)) {
      return templatePath;
    }
  }

  return null;
}

function fixPath(relativePath, name, root, templateExtensions, isAddon) {
  // Handle addons
  if (isAddon) {
    // Handle addons (served from dummy app)
    if (relativePath.startsWith('dummy')) {
      relativePath = relativePath.replace('dummy', 'app');
      var dummyPath = path.join('tests', 'dummy', relativePath);
      return (
        getPathForRealFile(dummyPath, root, templateExtensions) ||
        getPathForRealFile(relativePath, root, templateExtensions) ||
        relativePath
      );
    }

    // Handle addons renaming of modules/my-addon or my-addon (depending on ember-cli version)
    var regex = new RegExp('^(modules/)?' + name + '/');
    if (regex.test(relativePath)) {
      relativePath = relativePath.replace(regex, 'addon/');
      return (
        getPathForRealFile(relativePath, root, templateExtensions) ||
        relativePath
      );
    }
  } else {
    relativePath = relativePath.replace(name, 'app');
    return getPathForRealFile(relativePath, root, templateExtensions) || relativePath;
  }

  return relativePath;
}
