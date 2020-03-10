/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/store/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/store/artboard.js":
/*!*************************************!*\
  !*** ./resources/store/artboard.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var processMask = function processMask(_ref) {
  var layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.sketchObject.hasClippingMask()) {
      var maskIndex = layer.index;
      var maskParent = layer.parent;
      layer.sketchObject.setHasClippingMask(false); // create new group to mimic mask behavior

      var maskGroup = new sketch.Group({
        name: 'srm.mask',
        frame: layer.frame,
        layers: [layer.duplicate()]
      }); // splice in mask group, splice out old mask

      maskParent.layers.splice(maskIndex, 1, maskGroup); // loop through mask parent layers,
      // any layer with an index higher than the mask will be masked
      // push masked layers to maskGroup

      maskGroup.parent.layers.forEach(function (maskedLayer, index) {
        if (index > maskIndex) {
          maskedLayer.frame.x = maskedLayer.frame.x - maskGroup.frame.x;
          maskedLayer.frame.y = maskedLayer.frame.y - maskGroup.frame.y;
          maskGroup.layers.push(maskedLayer);
        }
      });
      resolve(maskGroup);
    } else {
      resolve(layer);
    }
  });
};

var isPathClockwise = function isPathClockwise(points) {
  var end = points.length - 1;
  var sum = points[end].point.x * points[0].point.y - points[0].point.x * points[end].point.y;

  for (var i = 0; i < end; i++) {
    var n = i + 1;
    sum += points[i].point.x * points[n].point.y - points[n].point.x * points[i].point.y;
  }

  return sum > 0;
};

var flattenShapePath = function flattenShapePath(_ref2) {
  var layer = _ref2.layer,
      sketch = _ref2.sketch;
  return new Promise(function (resolve, reject) {
    // due to the way PIXI draws lines
    // the path must be clockwise to render correctly
    var isClockwise = isPathClockwise(layer.points);

    if (!isClockwise) {
      layer.sketchObject.reversePath();
    }

    var duplicate = layer.duplicate();
    duplicate.transform.rotation = 0;
    duplicate.transform.flippedHorizontally = false;
    duplicate.transform.flippedVertically = false;
    var svgPath = duplicate.getSVGPath();
    var flatPath = sketch.ShapePath.fromSVGPath(svgPath);
    layer.points = flatPath.points;
    duplicate.remove();
    resolve(layer);
  });
};

var processShapePathBorderOptions = function processShapePathBorderOptions(_ref3) {
  var layer = _ref3.layer;
  return new Promise(function (resolve, reject) {
    var parent = layer.parent,
        index = layer.index,
        style = layer.style;
    var borderOptions = style.borderOptions;

    if (borderOptions.dashPattern.length > 0 || borderOptions.startArrowhead !== 'None' || borderOptions.endArrowhead !== 'None') {
      layer.sketchObject.layersByConvertingToOutlines();
      var outlines = parent.layers[index];
      outlines.name = "[srm.with-border-options]".concat(layer.name);
      outlines.sketchObject.simplify();
      resolve(outlines);
    } else {
      resolve(layer);
    }
  });
};

var processShapePath = function processShapePath(_ref4) {
  var layer = _ref4.layer,
      sketch = _ref4.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'ShapePath') {
      flattenShapePath({
        layer: layer,
        sketch: sketch
      }).then(function (layerS1) {
        return processShapePathBorderOptions({
          layer: layerS1
        });
      }).then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processShapeBase = function processShapeBase(_ref5) {
  var layer = _ref5.layer;
  return new Promise(function (resolve, reject) {
    var style = layer.style,
        parent = layer.parent,
        index = layer.index;

    if (layer.sketchObject.canFlatten()) {
      layer.sketchObject.flatten();
      resolve(parent.layers[index]);
    } else {
      if (layer.layers.length === 1) {
        layer.sketchObject.ungroup();
        var ungrouped = parent.layers[index];
        ungrouped.style = style;
        resolve(ungrouped);
      } else {
        resolve(layer);
      }
    }
  });
};

var processShape = function processShape(_ref6) {
  var layer = _ref6.layer,
      sketch = _ref6.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Shape') {
      processShapeBase({
        layer: layer
      }) // .then((layerS1) => {
      //   if (layerS1.type === 'Shape') {
      //     return processShapeLayers({
      //       layer: layerS1 as srm.Shape,
      //       sketch: sketch
      //     });
      //   } else {
      //     resolve(layerS1);
      //   }
      // })
      .then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processRelevant = function processRelevant(_ref7) {
  var layer = _ref7.layer;
  return new Promise(function (resolve, reject) {
    switch (layer.type) {
      case 'Group':
      case 'Shape':
      case 'Image':
      case 'ShapePath':
      case 'Text':
      case 'SymbolInstance':
        resolve(layer);
        break;

      case 'HotSpot':
      case 'Slice':
        layer.remove();
        resolve(null);
        break;
    }
  });
};

var processHidden = function processHidden(_ref8) {
  var layer = _ref8.layer;
  return new Promise(function (resolve, reject) {
    var isHidden = layer && layer.hidden;

    if (isHidden) {
      layer.remove();
      resolve(null);
    } else {
      resolve(layer);
    }
  });
};

var processSymbol = function processSymbol(_ref9) {
  var layer = _ref9.layer;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'SymbolInstance') {
      resolve(layer.detach({
        recursively: true
      }));
    } else {
      resolve(layer);
    }
  });
};

var processText = function processText(_ref10) {
  var layer = _ref10.layer,
      sketch = _ref10.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Text') {
      if (layer.text.trim().length === 0) {
        layer.remove();
        resolve(null);
      } else {
        var layerIndex = layer.index;
        var parent = layer.parent;
        layer.sketchObject.layersByConvertingToOutlines();
        var outlines = parent.layers[layerIndex];
        outlines.name = "[srm.text]".concat(layer.name); // because sketch is bugged

        outlines.sketchObject.simplify(); // because pixi is bugged

        outlines.sketchObject.reversePath();
        resolve(outlines);
      }
    } else {
      resolve(layer);
    }
  });
};

var processLayer = function processLayer(_ref11) {
  var layer = _ref11.layer,
      sketch = _ref11.sketch,
      page = _ref11.page;
  return new Promise(function (resolve, reject) {
    processRelevant({
      layer: layer
    }).then(function (layerS1) {
      return processHidden({
        layer: layerS1
      });
    }).then(function (layerS2) {
      return processSymbol({
        layer: layerS2
      });
    }).then(function (layerS3) {
      return processShape({
        layer: layerS3,
        sketch: sketch
      });
    }).then(function (layerS4) {
      return processShapePath({
        layer: layerS4,
        sketch: sketch
      });
    }).then(function (layerS5) {
      return processMask({
        layer: layerS5,
        sketch: sketch
      });
    }).then(function (layerS6) {
      return processText({
        layer: layerS6,
        sketch: sketch
      });
    }).then(function (layerS7) {
      if (layerS7 && layerS7.type === 'Group') {
        processLayers({
          layers: layerS7.layers,
          sketch: sketch,
          page: page
        }).then(function () {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

var processLayers = function processLayers(_ref12) {
  var layers = _ref12.layers,
      sketch = _ref12.sketch,
      page = _ref12.page;
  var promises = [];
  layers.forEach(function (layer) {
    promises.push(processLayer({
      layer: layer,
      sketch: sketch,
      page: page
    }));
  });
  return Promise.all(promises);
};

var getArtboard = function getArtboard(_ref13) {
  var artboard = _ref13.artboard,
      sketch = _ref13.sketch,
      page = _ref13.page;
  return new Promise(function (resolve, reject) {
    processLayers({
      layers: artboard.layers,
      sketch: sketch,
      page: page
    }).then(function () {
      resolve();
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getArtboard);

/***/ }),

/***/ "./resources/store/assets.js":
/*!***********************************!*\
  !*** ./resources/store/assets.js ***!
  \***********************************/
/*! exports provided: clearLayerStyles, generateImageAsset, processLayerFills, processLayerBorders, processLayers, getAssets, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearLayerStyles", function() { return clearLayerStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateImageAsset", function() { return generateImageAsset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayerFills", function() { return processLayerFills; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayerBorders", function() { return processLayerBorders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayers", function() { return processLayers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAssets", function() { return getAssets; });
/* harmony import */ var _imageAssets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageAssets */ "./resources/store/imageAssets.js");
/* harmony import */ var _shapeAssets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shapeAssets */ "./resources/store/shapeAssets.js");
/* harmony import */ var _groupAssets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./groupAssets */ "./resources/store/groupAssets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var clearLayerStyles = function clearLayerStyles(_ref) {
  var layer = _ref.layer,
      page = _ref.page;
  return new Promise(function (resolve, reject) {
    var style = layer.style,
        transform = layer.transform;

    if (layer.type === 'Text') {
      style.textColor = '#000000ff';
      layer.sketchObject.setTextBehaviour(0);
    } // @ts-ignore


    layer.parent = page;
    style.opacity = 1;
    style.borders = [];
    style.fills = [];
    style.shadows = [];
    style.innerShadows = [];
    style.blur = {
      blurType: 'Gaussian',
      radius: 0,
      motionAngle: 0,
      center: {
        x: 0,
        y: 0
      },
      enabled: false
    };
    transform.flippedHorizontally = false;
    transform.flippedVertically = false;
    transform.rotation = 0;
    resolve(layer);
  });
};
var generateImageAsset = function generateImageAsset(_ref2) {
  var layer = _ref2.layer,
      sketch = _ref2.sketch,
      id = _ref2.id,
      prefix = _ref2.prefix,
      scale = _ref2.scale;
  return new Promise(function (resolve, reject) {
    // create buffer from layer
    var buffer = sketch["export"](layer, _defineProperty({
      formats: 'png',
      scales: scale ? scale : '1',
      output: false
    }, 'save-for-web', true)); // create image layer from buffer

    var bufferImg = new sketch.Image({
      image: buffer
    }); // get base64 from image layer nsdata

    var base64 = bufferImg.image.nsdata.base64EncodedStringWithOptions(0); // create base64 string

    var base64String = "data:image/png;base64,".concat(base64); // return final image

    resolve({
      id: prefix ? "".concat(prefix).concat(id) : id,
      src: base64String
    });
  });
};

var createGradientBorderImage = function createGradientBorderImage(_ref3) {
  var page = _ref3.page,
      layer = _ref3.layer,
      border = _ref3.border,
      gradientOpacity = _ref3.gradientOpacity,
      sketch = _ref3.sketch,
      prefix = _ref3.prefix;
  return new Promise(function (resolve, reject) {
    var padding = function padding() {
      switch (border.position) {
        case 'Outside':
          return border.thickness;

        case 'Center':
          return border.thickness / 2;

        case 'Inside':
          return 0;
      }
    }; // create new layer with gradient


    var gradientImage = new sketch.ShapePath({
      parent: page,
      frame: Object.assign(Object.assign({}, layer.frame), {
        width: layer.frame.width + padding(),
        height: layer.frame.height + padding()
      }),
      style: {
        fills: [{
          fillType: 'Gradient',
          gradient: border.gradient
        }],
        borders: [],
        opacity: gradientOpacity
      }
    }); // export image to temp dir

    generateImageAsset({
      layer: gradientImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      gradientImage.remove(); // return final image

      resolve(imageAsset);
    });
  });
};

var createGradientFillImage = function createGradientFillImage(_ref4) {
  var page = _ref4.page,
      layer = _ref4.layer,
      gradient = _ref4.gradient,
      gradientOpacity = _ref4.gradientOpacity,
      sketch = _ref4.sketch,
      prefix = _ref4.prefix;
  return new Promise(function (resolve, reject) {
    // create new layer with gradient
    var gradientImage = new sketch.ShapePath({
      parent: page,
      frame: layer.frame,
      style: {
        fills: [{
          fillType: 'Gradient',
          gradient: gradient
        }],
        borders: [],
        opacity: gradientOpacity
      }
    }); // export image to temp dir

    generateImageAsset({
      layer: gradientImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      gradientImage.remove(); // return final image

      resolve(imageAsset);
    });
  });
};

var createPatternFillImage = function createPatternFillImage(_ref5) {
  var page = _ref5.page,
      layer = _ref5.layer,
      pattern = _ref5.pattern,
      fillOpacity = _ref5.fillOpacity,
      sketch = _ref5.sketch,
      prefix = _ref5.prefix;
  return new Promise(function (resolve, reject) {
    // create new layer with pattern
    // add transparent border to include any layer whitespace
    var patternImage = new sketch.ShapePath({
      parent: page,
      frame: layer.frame,
      style: {
        fills: [{
          fillType: 'Pattern',
          pattern: pattern
        }],
        borders: [{
          fillType: 'Color',
          position: 'Inside',
          color: '#00000001'
        }],
        opacity: fillOpacity
      }
    }); // generate base64 image from layer

    generateImageAsset({
      layer: patternImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      patternImage.remove(); // return final base64 image

      resolve(imageAsset);
    });
  });
};

var processLayerBorderGradient = function processLayerBorderGradient(_ref6) {
  var page = _ref6.page,
      layer = _ref6.layer,
      border = _ref6.border,
      borderIndex = _ref6.borderIndex,
      sketch = _ref6.sketch;
  return new Promise(function (resolve, reject) {
    createGradientBorderImage({
      page: page,
      layer: layer,
      border: border,
      gradientOpacity: border.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: "[border-".concat(borderIndex, "]")
    }).then(function (gradientBorderImage) {
      resolve(gradientBorderImage);
    });
  });
};

var processLayerFillGradient = function processLayerFillGradient(_ref7) {
  var page = _ref7.page,
      layer = _ref7.layer,
      fill = _ref7.fill,
      fillIndex = _ref7.fillIndex,
      sketch = _ref7.sketch;
  return new Promise(function (resolve, reject) {
    createGradientFillImage({
      page: page,
      layer: layer,
      gradient: fill.gradient,
      gradientOpacity: fill.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: "[fill-".concat(fillIndex, "]")
    }).then(function (gradientFillImage) {
      resolve(gradientFillImage);
    });
  });
};

var processLayerFillPattern = function processLayerFillPattern(_ref8) {
  var page = _ref8.page,
      layer = _ref8.layer,
      fill = _ref8.fill,
      fillIndex = _ref8.fillIndex,
      sketch = _ref8.sketch;
  return new Promise(function (resolve, reject) {
    if (fill.pattern.image) {
      createPatternFillImage({
        page: page,
        layer: layer,
        pattern: fill.pattern,
        fillOpacity: fill.sketchObject.contextSettings().opacity(),
        sketch: sketch,
        prefix: "[fill-".concat(fillIndex, "]")
      }).then(function (patternFillImage) {
        resolve(patternFillImage);
      });
    } else {
      resolve(null);
    }
  });
};

var processLayerFill = function processLayerFill(_ref9) {
  var page = _ref9.page,
      layer = _ref9.layer,
      fill = _ref9.fill,
      fillIndex = _ref9.fillIndex,
      sketch = _ref9.sketch;
  return new Promise(function (resolve, reject) {
    switch (fill.fillType) {
      case 'Pattern':
        processLayerFillPattern({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Gradient':
        processLayerFillGradient({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Color':
        resolve(null);
        break;
    }
  });
};

var processLayerFills = function processLayerFills(_ref10) {
  var page = _ref10.page,
      layer = _ref10.layer,
      sketch = _ref10.sketch,
      fills = _ref10.fills;
  var promises = [];
  fills.forEach(function (fill, fillIndex) {
    if (fill.enabled) {
      promises.push(processLayerFill({
        page: page,
        layer: layer,
        fill: fill,
        fillIndex: fillIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

var processLayerBorder = function processLayerBorder(_ref11) {
  var page = _ref11.page,
      layer = _ref11.layer,
      border = _ref11.border,
      borderIndex = _ref11.borderIndex,
      sketch = _ref11.sketch;
  return new Promise(function (resolve, reject) {
    switch (border.fillType) {
      case 'Gradient':
        processLayerBorderGradient({
          page: page,
          layer: layer,
          border: border,
          borderIndex: borderIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Pattern':
      case 'Color':
        resolve(null);
        break;
    }
  });
};

var processLayerBorders = function processLayerBorders(_ref12) {
  var page = _ref12.page,
      layer = _ref12.layer,
      sketch = _ref12.sketch,
      borders = _ref12.borders;
  var promises = [];
  borders.forEach(function (border, borderIndex) {
    if (border.enabled) {
      promises.push(processLayerBorder({
        page: page,
        layer: layer,
        border: border,
        borderIndex: borderIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

var processLayer = function processLayer(_ref13) {
  var page = _ref13.page,
      layer = _ref13.layer,
      sketch = _ref13.sketch;
  return new Promise(function (resolve, reject) {
    var layerImages = [];

    switch (layer.type) {
      case 'Image':
        Object(_imageAssets__WEBPACK_IMPORTED_MODULE_0__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (imageLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(imageLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      case 'Shape':
      case 'ShapePath':
        Object(_shapeAssets__WEBPACK_IMPORTED_MODULE_1__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (shapeLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(shapeLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      case 'Group':
        Object(_groupAssets__WEBPACK_IMPORTED_MODULE_2__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (groupLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(groupLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      default:
        resolve(layerImages);
    }
  });
};

var processLayers = function processLayers(_ref14) {
  var page = _ref14.page,
      layers = _ref14.layers,
      sketch = _ref14.sketch;
  var promises = [];
  layers.forEach(function (layer) {
    promises.push(processLayer({
      page: page,
      layer: layer,
      sketch: sketch
    }));
  });
  return Promise.all(promises);
};
var getAssets = function getAssets(_ref15) {
  var page = _ref15.page,
      artboard = _ref15.artboard,
      sketch = _ref15.sketch;
  return new Promise(function (resolve, reject) {
    processLayers({
      page: page,
      layers: artboard.layers,
      sketch: sketch
    }).then(function (layerImages) {
      var images = layerImages.reduce(function (imageArray, layerImageArray) {
        return [].concat(_toConsumableArray(imageArray), _toConsumableArray(layerImageArray));
      }, []);
      resolve(images);
    });
  });
};
/* harmony default export */ __webpack_exports__["default"] = (getAssets);

/***/ }),

/***/ "./resources/store/groupAssets.js":
/*!****************************************!*\
  !*** ./resources/store/groupAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processGroupLayerAssets = function processGroupLayerAssets(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    var layerImages = [];
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayers"])({
      page: page,
      layers: layer.layers,
      sketch: sketch
    }).then(function (groupLayerImages) {
      var images = groupLayerImages.reduce(function (imageArray, layerImageArray) {
        return [].concat(_toConsumableArray(imageArray), _toConsumableArray(layerImageArray));
      }, []);
      layerImages.push.apply(layerImages, _toConsumableArray(images));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processGroupLayerAssets);

/***/ }),

/***/ "./resources/store/imageAssets.js":
/*!****************************************!*\
  !*** ./resources/store/imageAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processLayerImage = function processLayerImage(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    // create image layer from image date
    var baseImage = new sketch.Image({
      image: layer.image,
      frame: layer.frame,
      parent: page
    });
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["generateImageAsset"])({
      layer: baseImage,
      sketch: sketch,
      id: layer.id,
      prefix: '[image]'
    }).then(function (imageAsset) {
      // remove asset artboard from page
      baseImage.remove(); // return base64 image

      resolve(imageAsset);
    });
  });
};

var processImageLayerAssets = function processImageLayerAssets(_ref2) {
  var page = _ref2.page,
      layer = _ref2.layer,
      sketch = _ref2.sketch;
  return new Promise(function (resolve, reject) {
    var style = layer.style;
    var fills = style.fills,
        borders = style.borders,
        shadows = style.shadows,
        innerShadows = style.innerShadows;
    var layerImages = [];
    processLayerImage({
      page: page,
      layer: layer,
      sketch: sketch
    }).then(function (layerImage) {
      layerImages.push(layerImage);
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerFills"])({
        page: page,
        layer: layer,
        sketch: sketch,
        fills: fills
      });
    }).then(function (fillImages) {
      var newImages = fillImages.filter(function (fillImage) {
        return fillImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerBorders"])({
        page: page,
        layer: layer,
        sketch: sketch,
        borders: borders
      });
    }).then(function (borderImages) {
      var newImages = borderImages.filter(function (borderImage) {
        return borderImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processImageLayerAssets);

/***/ }),

/***/ "./resources/store/index.js":
/*!**********************************!*\
  !*** ./resources/store/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _artboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artboard */ "./resources/store/artboard.js");
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");



var getStore = function getStore(_ref) {
  var page = _ref.page,
      artboard = _ref.artboard,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    // create new page for clean asset generation
    var srmPage = new sketch.Page({
      name: "srm.page",
      parent: page.parent
    }); // duplicate selected artboard and set on new page

    var srmArtboard = artboard.duplicate();
    srmArtboard.parent = srmPage;
    srmArtboard.frame.x = 0;
    srmArtboard.frame.y = 0;
    srmArtboard.background.includedInExport = true;
    console.log('Processing Artboard');
    Object(_artboard__WEBPACK_IMPORTED_MODULE_0__["default"])({
      artboard: srmArtboard,
      sketch: sketch,
      page: page
    }).then(function () {
      console.log('Processing Assets');
      return Object(_assets__WEBPACK_IMPORTED_MODULE_1__["default"])({
        page: srmPage,
        artboard: srmArtboard,
        sketch: sketch
      });
    }).then(function (images) {
      console.log('Assets Created'); // remove page

      srmPage.remove(); // select original page

      page.selected = true; // return final store

      resolve({
        artboard: srmArtboard,
        images: images
      });
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getStore);

/***/ }),

/***/ "./resources/store/shapeAssets.js":
/*!****************************************!*\
  !*** ./resources/store/shapeAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processShapeLayerAssets = function processShapeLayerAssets(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    var style = layer.style;
    var fills = style.fills,
        borders = style.borders,
        shadows = style.shadows,
        innerShadows = style.innerShadows;
    var layerImages = [];
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerFills"])({
      page: page,
      layer: layer,
      sketch: sketch,
      fills: fills
    }).then(function (fillImages) {
      var newImages = fillImages.filter(function (fillImage) {
        return fillImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerBorders"])({
        page: page,
        layer: layer,
        sketch: sketch,
        borders: borders
      });
    }).then(function (borderImages) {
      var newImages = borderImages.filter(function (borderImage) {
        return borderImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processShapeLayerAssets);

/***/ })

/******/ });
//# sourceMappingURL=resources_store_index.js.map