declare namespace srm {
  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Sketch Models
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type Sketch = any;
  type Buffer = any;

  // Models / Document

  interface Document {
    id: string;
    pages: Page[];
    selectedPage: Page;
    selectedLayers: Selection;
    path: string;
    sharedLayerStyles: SharedStyle[];
    sharedTextStyles: SharedStyle[];
    colors: ColorAsset[];
    gradients: GradientAsset[];
    colorSpace: ColorSpace;
  }

  // Models / Document / ColorSpace

  type ColorSpace = 'Unmanaged' | 'sRGB' | 'P3';

  // Models / Library

  interface Library {
    readonly id: string;
    readonly name: string;
    readonly valid: boolean;
    enabled: boolean;
    readonly libraryType: LibraryType;
    readonly lastModifiedAt: Date;
  }

  // Models / Library / LibraryType

  type LibraryType = 'Internal' | 'User' | 'Remote';

  // Models / ImportableObject

  interface ImportableObject {
    id: string;
    name: string;
    objectType: ImportableObjectType;
    library: Library;
  }

  // Models / ImportableObject / ImportableObjectType

  type ImportableObjectType = 'Symbol' | 'LayerStyle' | 'TextStyle';

  // Models / Style

  interface Style {
    opacity: number;
    blendingMode: BlendingMode;
    blur: Blur;
    fills: Fill[];
    borders: Border[];
    borderOptions: BorderOptions;
    shadows: Shadow[];
    innerShadows: Shadow[];
    alignment: Alignment;
    verticalAlignment: VerticalAlignment;
    kerning: number | null;
    lineHeight: number | null;
    paragraphSpacing: number;
    textColor: string;
    fontSize: number;
    textTransform: TextTransform;
    fontFamily: string;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    fontVariant: FontVariant;
    fontStretch: FontStretch;
    textUnderline: TextUnderline;
    textStrikethrough: TextStrikethrough;
    fontAxes: FontAxes[];
  }

  // Models / Style / BlendingMode

  type BlendingMode = 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'Lighten' | 'Screen' | 'ColorDodge' | 'Overlay' | 'SoftLight' | 'HardLight' | 'Difference' | 'Exclusion' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';

  // Models / Style / Blur

  interface Blur {
    blurType: BlurType;
    radius: number;
    motionAngle: number;
    center: BlurCenter;
    enabled: boolean;
  }

  // Models / Style / Blur / BlurType

  type BlurType = 'Gaussian' | 'Motion' | 'Zoom' | 'Background';

  // Models / Style / Blur / BlurCenter

  interface BlurCenter {
    x: number;
    y: number;
  }

  // Models / Style / Border

  interface Border {
    fillType: FillType;
    color: string;
    gradient: Gradient;
    enabled: boolean;
    position: BorderPosition;
    thickness: number;
    sketchObject?: any;
  }

  // Models / Style / Border / BorderPosition

  type BorderPosition = 'Center' | 'Inside' | 'Outside';

  // Models / Style / BorderOptions

  interface BorderOptions {
    startArrowhead: ArrowHead;
    endArrowhead: ArrowHead;
    dashPattern: number[];
    lineEnd: LineEnd;
    lineJoin: LineJoin;
  }

  // Models / Style / BorderOptions / ArrowHead

  type ArrowHead = 'None' | 'OpenArrow' | 'FilledArrow' | 'Line' | 'OpenCircle' | 'FilledCircle' | 'OpenSquare' | 'FilledSquare';

  // Models / Style / BorderOptions / LineEnd

  type LineEnd = 'Butt' | 'Round' | 'Projecting';

  // Models / Style / BorderOptions / LineJoin

  type LineJoin = 'Miter' | 'Round' | 'Bevel';

  // Models / Style / Fill

  interface Fill {
    fillType: FillType;
    color: string;
    gradient: Gradient;
    pattern: Pattern;
    enabled: boolean;
    sketchObject?: any;
  }

  // Models / Style / Fill / FillType

  type FillType = 'Color' | 'Gradient' | 'Pattern';

  // Models / Style / Fill / Gradient

  interface Gradient {
    gradientType: GradientType;
    from: Point;
    to: Point;
    aspectRatio: number;
    stops: GradientStop[];
  }

  // Models / Style / Fill / Gradient / GradientType

  type GradientType = 'Linear' | 'Radial' | 'Angular';

  // Models / Style / Fill / Gradient / GradientStop

  interface GradientStop {
    position: number;
    color: string;
  }

  // Models / Style / Fill / Pattern

  interface Pattern {
    patternType: PatternFillType;
    image: ImageData | null;
    tileScale: number;
  }

  // Models / Style / Fill / Pattern / PatternFillType

  type PatternFillType = 'Tile' | 'Fill' | 'Stretch' | 'Fit';

  // Models / Style / Shadow

  interface Shadow {
    color: string;
    blur: number;
    x: number;
    y: number;
    spread: number;
    enabled: boolean;
  }

  // Models / Style / Alignment

  type Alignment = 'left' | 'right' | 'center' | 'justified';

  // Models / Style / VerticalAlignment

  type VerticalAlignment = 'top' | 'center' | 'bottom';

  // Models / Style / TextTransform

  type TextTransform = 'none' | 'uppercase' | 'lowercase';

  // Models / Style / FontWeight

  type FontWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  // Models / Style / FontStyle

  type FontStyle = 'italic' | undefined;

  // Models / Style / FontVariant

  type FontVariant = 'small-caps' | undefined;

  // Models / Style / FontStretch

  type FontStretch = 'compressed' | 'condensed' | 'narrow' | 'expanded' | 'poster' | undefined;

  // Models / Style / TextUnderline

  type TextUnderline = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';

  // Models / Style / TextStrikethrough

  type TextStrikethrough = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';

  // Models / Style / FontAxes

  interface FontAxes {
    id: string;
    min: number;
    max: number;
    value: number;
  }

  // Models / SharedStyle

  interface SharedStyle {
    id: string;
    styleType: StyleType;
    name: string;
    style: Style;
  }

  // Models / SharedStyle / StyleType

  type StyleType = 'Text' | 'Layer' | 'Unknown';

  // Models / Override

  interface Override {
    path: string;
    property: string;
    id: string;
    symbolOverride: boolean;
    value: string | ImageData;
    isDefault: boolean;
    affectedLayer: Text | Image | SymbolInstance;
    editable: boolean;
    selected: boolean | undefined;
  }

  // Models / Flow

  interface Flow {
    target: Artboard | BackTarget;
    targetId: string | BackTarget;
    animationType: AnimationType;
  }

  // Models / Flow / BackTarget

  type BackTarget = any;

  // Models / Flow / AnimationType

  type AnimationType = 'none' | 'slideFromLeft' | 'slideFromRight' | 'slideFromBottom' | 'slideFromTop';

  // Models / ExportFormat

  interface ExportFormat {
    fileFormat: FileFormat;
    prefix: string | undefined;
    suffix: string | undefined;
    size: string;
  }

  // Models / ExportFormat / FileFormat

  type FileFormat = 'jpg' | 'png' | 'tiff' | 'eps' | 'pdf' | 'webp' | 'svg';

  // Models / Selection

  interface Selection {
    layers: Layer[];
    readonly length: number;
    readonly isEmpty: boolean;
  }

  // Models / Point

  interface Point {
    x: number;
    y: number;
  }

  // Models / CurvePoint

  interface CurvePoint {
    point: Point;
    curveFrom: Point;
    curveTo: Point;
    cornerRadius: number;
    pointType: PointType;
  }

  // Models / CurvePoint / PointType

  type PointType = 'Undefined' | 'Straight' | 'Mirrored' | 'Asymmetric' | 'Disconnected';

  // Models / Rectangle

  interface Rectangle {
    x: number;
    y: number;
    height: number;
    width: number;
    changeBasis(basis: any): any;
  }

  // Models / ColorAsset

  interface ColorAsset {
    name: string;
    color: string;
  }

  // Models / GradientAsset

  interface GradientAsset {
    name: string;
    gradient: Gradient;
  }

  // Models / SmartLayout

  type SmartLayout = 'LeftToRight' | 'HorizontallyCenter' | 'RightToLeft' | 'TopToBottom' | 'VerticallyCenter' | 'BottomToTop';

  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Sketch Layers
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type SketchLayer = Group | Page | Artboard | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type PageLayer = Group | Artboard | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type ArtboardLayer = Group | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type RelevantLayer = Group | Shape | Image | ShapePath | Text;

  // Layers / Layer

  interface Layer {
    id: string;
    name: string;
    parent: Group;
    locked: boolean;
    hidden: boolean;
    frame: Rectangle;
    selected: boolean;
    flow: Flow;
    exportFormats: ExportFormat[];
    transform: Transform;
    index: number;
    type: string;
    sketchObject: any;
    duplicate(): any;
    remove(): any;
  }

  // Layers / Layer / Transform

  interface Transform {
    rotation: number;
    flippedHorizontally: boolean;
    flippedVertically: boolean;
  }

  // Layers / Group

  interface Group extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    layers: Layer[];
    smartLayout: SmartLayout;
  }

  // Layers / Page

  type Page = Omit<Group, 'flow' | 'locked' | 'hidden' | 'exportFormats' | 'transform' | 'style' | 'sharedStyle' | 'sharedStyleId' | 'smartLayout'>;

  // Layers / Artboard

  interface Artboard extends Omit<Group, 'flow' | 'locked' | 'hidden' | 'transform' | 'style' | 'sharedStyle' | 'sharedStyleId' | 'smartLayout' | 'parent'> {
    parent: Page;
    flowStartPoint: boolean;
    background: Background;
  }

  // Layers / Artboard / Background

  interface Background {
    enabled: boolean;
    includedInExport: boolean;
    color: string;
  }

  // Layers / Shape

  interface Shape extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    layers: ShapePath[];
  }

  // Layers / Image

  interface Image extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    image: ImageData;
  }

  // Layers / Image / ImageData

  interface ImageData {
    id: string;
    nsimage: NSImage;
    nsdata: NSData;
  }

  // Layers / Image / ImageData / NSImage

  type NSImage = any;

  // Layers / Image / ImageData / NSData

  type NSData = any;

  // Layers / ShapePath

  interface ShapePath extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    shapeType: ShapeType;
    points: CurvePoint[];
    closed: boolean;
    getSVGPath(): string;
  }

  // Layers / ShapePath / ShapeType

  type ShapeType = 'Rectangle' | 'Oval' | 'Triangle' | 'Polygon' | 'Star' | 'Custom';

  // Layers / Text

  interface Text extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    text: string;
    lineSpacing: LineSpacing;
    fixedWidth: boolean;
  }

  // Layers / Text / LineSpacing

  type LineSpacing = 'constantBaseline' | 'variable';

  // Layers / SymbolMaster

  interface SymbolMaster extends Layer {
    layers: Layer[];
    symbolId: string;
    overrides: Override[];
  }

  // Layers / SymbolMaster / Background

  interface SymbolMasterBackground extends Background {
    includedInInstance: boolean;
  }

  // Layers / SymbolInstance

  interface SymbolInstance extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    master: SymbolMaster;
    overrides: Override[];
    detach(options?: {recursively: boolean}): Group;
  }

  // Layers / HotSpot

  type HotSpot = Omit<Layer, 'exportFormats' | 'transform'>;

  // Layers / Slice

  type Slice = Omit<Layer, 'transform'>;

  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // App
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type AppLayer = Artboard | Image | Shape | ShapePath | Text | Group;
  type AppArtboardLayer = Image | Shape | ShapePath | Text | Group;

  interface Origin {
    top: number;
    right: number;
    bottom: number;
    left: number;
    yCenter: number;
    xCenter: number;
  }

  interface GroupShadows {
    id: string,
    shadows: srm.Shadow[];
  }

  interface ShapePartial extends ShapePath {
    type: 'ShapePartial';
    shape: Shape;
    holes: ShapePartialHole[];
  }

  interface ShapePartialHole extends ShapePath {
    type: 'ShapePartialHole';
    shapeId: String;
    shapePath: ShapePath;
  }

  interface SvgAsset {
    id: string;
    src: string;
  }

  interface base64Image {
    id: string;
    src: string;
  }

  type Theme = 'light' | 'dark';

  interface AppStore {
    artboard: srm.Artboard;
    images: srm.base64Image[];
  }
}