import type { ComponentProps} from 'react'

export type HTML                = ReadonlyComponentProps<'html'>
export type Body                = ReadonlyComponentProps<'body'>
export type Title               = ReadonlyComponentProps<'title'>
export type Base                = ReadonlyComponentProps<'base'>
export type Link                = ReadonlyComponentProps<'link'>
export type Meta                = ReadonlyComponentProps<'meta'>
export type Style               = ReadonlyComponentProps<'style'>
export type Address             = ReadonlyComponentProps<'address'>
export type Article             = ReadonlyComponentProps<'article'>
export type Aside               = ReadonlyComponentProps<'aside'>
export type Footer              = ReadonlyComponentProps<'footer'>
export type Header              = ReadonlyComponentProps<'header'>
export type Main                = ReadonlyComponentProps<'main'>
export type Nav                 = ReadonlyComponentProps<'nav'>
export type Section             = ReadonlyComponentProps<'section'>
export type Blockquote          = ReadonlyComponentProps<'blockquote'>
export type DD                  = ReadonlyComponentProps<'dd'>
export type Div                 = ReadonlyComponentProps<'div'>
export type DL                  = ReadonlyComponentProps<'dl'>
export type DT                  = ReadonlyComponentProps<'dt'>
export type Figcaption          = ReadonlyComponentProps<'figcaption'>
export type Figure              = ReadonlyComponentProps<'figure'>
export type HR                  = ReadonlyComponentProps<'hr'>
export type Menu                = ReadonlyComponentProps<'menu'>
export type List                = ReadonlyComponentProps<'li'>
export type OrderedList         = Readonly<Omit<ComponentProps<'ol'>, 'type'> & { type? : 'A' | 'I' | '1' | 'a' | 'i' }>
export type UnorderedList       = ReadonlyComponentProps<'ul'>
export type Pre                 = ReadonlyComponentProps<'pre'>
export type A                   = ReadonlyComponentProps<'a'>
export type Abbr                = ReadonlyComponentProps<'abbr'>
export type B                   = ReadonlyComponentProps<'b'>
export type BDI                 = ReadonlyComponentProps<'bdi'>
export type BDO                 = ReadonlyComponentProps<'bdo'>
export type Break               = ReadonlyComponentProps<'br'>
export type Cite                = ReadonlyComponentProps<'cite'>
export type Code                = ReadonlyComponentProps<'code'>
export type Data                = ReadonlyComponentProps<'data'>
export type Del                 = ReadonlyComponentProps<'del'>
export type Dfn                 = ReadonlyComponentProps<'dfn'>
export type Em                  = ReadonlyComponentProps<'em'>
export type I                   = ReadonlyComponentProps<'i'>
export type Ins                 = ReadonlyComponentProps<'ins'>
export type Kbd                 = ReadonlyComponentProps<'kbd'>
export type Mark                = ReadonlyComponentProps<'mark'>
export type Q                   = ReadonlyComponentProps<'q'>
export type RP                  = ReadonlyComponentProps<'rp'>
export type RT                  = ReadonlyComponentProps<'rt'>
export type Ruby                = ReadonlyComponentProps<'ruby'>
export type S                   = ReadonlyComponentProps<'s'>
export type Samp                = ReadonlyComponentProps<'samp'>
export type Small               = ReadonlyComponentProps<'small'>
export type Span                = ReadonlyComponentProps<'span'>
export type Strong              = ReadonlyComponentProps<'strong'>
export type Sub                 = ReadonlyComponentProps<'sub'>
export type Sup                 = ReadonlyComponentProps<'sup'>
export type Time                = ReadonlyComponentProps<'time'>
export type U                   = ReadonlyComponentProps<'u'>
export type Var                 = ReadonlyComponentProps<'var'>
export type WBR                 = ReadonlyComponentProps<'wbr'>
export type Area                = ReadonlyComponentProps<'area'>
export type Audio               = ReadonlyComponentProps<'audio'>
export type Map                 = ReadonlyComponentProps<'map'>
export type Track               = ReadonlyComponentProps<'track'>
export type Video               = ReadonlyComponentProps<'video'>
export type Embed               = ReadonlyComponentProps<'embed'>
export type IFrame              = ReadonlyComponentProps<'iframe'>
export type Object              = ReadonlyComponentProps<'object'>
export type Param               = ReadonlyComponentProps<'param'>
export type Picture             = ReadonlyComponentProps<'picture'>
export type Source              = ReadonlyComponentProps<'source'>
export type Canvas              = ReadonlyComponentProps<'canvas'>
export type NoScript            = ReadonlyComponentProps<'noscript'>
export type Script              = ReadonlyComponentProps<'script'>
export type Caption             = ReadonlyComponentProps<'caption'>
export type Col                 = ReadonlyComponentProps<'col'>
export type ColGroup            = ReadonlyComponentProps<'colgroup'>
export type Table               = ReadonlyComponentProps<'table'>
export type TBody               = ReadonlyComponentProps<'tbody'>
export type TD                  = ReadonlyComponentProps<'td'>
export type TFoot               = ReadonlyComponentProps<'tfoot'>
export type TH                  = ReadonlyComponentProps<'th'>
export type THead               = ReadonlyComponentProps<'thead'>
export type TR                  = ReadonlyComponentProps<'tr'>
export type DataList            = ReadonlyComponentProps<'datalist'>
export type Dialog              = ReadonlyComponentProps<'dialog'>
export type Summary             = ReadonlyComponentProps<'summary'>
export type Slot                = ReadonlyComponentProps<'slot'>
export type Template            = ReadonlyComponentProps<'template'>
export type SVG                 = ReadonlyComponentProps<'svg'>
export type Animate             = ReadonlyComponentProps<'animate'>
export type AnimateMotion       = ReadonlyComponentProps<'animateMotion'>
export type AnimateTransform    = ReadonlyComponentProps<'animateTransform'>
export type Circle              = ReadonlyComponentProps<'circle'>
export type ClipPath            = ReadonlyComponentProps<'clipPath'>
export type Defs                = ReadonlyComponentProps<'defs'>
export type Desc                = ReadonlyComponentProps<'desc'>
export type Ellipse             = ReadonlyComponentProps<'ellipse'>
export type FEBlend             = ReadonlyComponentProps<'feBlend'>
export type FEColorMatrix       = ReadonlyComponentProps<'feColorMatrix'>
export type FEComponentTransfer = ReadonlyComponentProps<'feComponentTransfer'>
export type FEComposite         = ReadonlyComponentProps<'feComposite'>
export type FEConvolveMatrix    = ReadonlyComponentProps<'feConvolveMatrix'>
export type FEDiffuseLighting   = ReadonlyComponentProps<'feDiffuseLighting'>
export type FEDisplacementMap   = ReadonlyComponentProps<'feDisplacementMap'>
export type FEDistantLight      = ReadonlyComponentProps<'feDistantLight'>
export type FEDropShadow        = ReadonlyComponentProps<'feDropShadow'>
export type FEFlood             = ReadonlyComponentProps<'feFlood'>
export type FEFuncA             = ReadonlyComponentProps<'feFuncA'>
export type FEFuncB             = ReadonlyComponentProps<'feFuncB'>
export type FEFuncG             = ReadonlyComponentProps<'feFuncG'>
export type FEFuncR             = ReadonlyComponentProps<'feFuncR'>
export type FEGaussianBlur      = ReadonlyComponentProps<'feGaussianBlur'>
export type FEImage             = ReadonlyComponentProps<'feImage'>
export type FEMerge             = ReadonlyComponentProps<'feMerge'>
export type FEMergeNode         = ReadonlyComponentProps<'feMergeNode'>
export type FEMorphology        = ReadonlyComponentProps<'feMorphology'>
export type FEOffset            = ReadonlyComponentProps<'feOffset'>
export type FEPointLight        = ReadonlyComponentProps<'fePointLight'>
export type FESpecularLighting  = ReadonlyComponentProps<'feSpecularLighting'>
export type FESpotLight         = ReadonlyComponentProps<'feSpotLight'>
export type FETile              = ReadonlyComponentProps<'feTile'>
export type FETurbulence        = ReadonlyComponentProps<'feTurbulence'>
export type Filter              = ReadonlyComponentProps<'filter'>
export type ForeignObject       = ReadonlyComponentProps<'foreignObject'>
export type G                   = ReadonlyComponentProps<'g'>
export type Image               = ReadonlyComponentProps<'image'>
export type Line                = ReadonlyComponentProps<'line'>
export type LinearGradient      = ReadonlyComponentProps<'linearGradient'>
export type Marker              = ReadonlyComponentProps<'marker'>
export type Mask                = ReadonlyComponentProps<'mask'>
export type Metadata            = ReadonlyComponentProps<'metadata'>
export type MPath               = ReadonlyComponentProps<'mpath'>
export type Path                = ReadonlyComponentProps<'path'>
export type Pattern             = ReadonlyComponentProps<'pattern'>
export type Polygon             = ReadonlyComponentProps<'polygon'>
export type Polyline            = ReadonlyComponentProps<'polyline'>
export type RadialGradient      = ReadonlyComponentProps<'radialGradient'>
export type Rect                = ReadonlyComponentProps<'rect'>
export type Set                 = ReadonlyComponentProps<'set'>
export type Stop                = ReadonlyComponentProps<'stop'>
export type Switch              = ReadonlyComponentProps<'switch'>
export type Symbol              = ReadonlyComponentProps<'symbol'>
export type Text                = ReadonlyComponentProps<'text'>
export type TextPath            = ReadonlyComponentProps<'textPath'>
export type TSpan               = ReadonlyComponentProps<'tspan'>
export type Use                 = ReadonlyComponentProps<'use'>
export type View                = ReadonlyComponentProps<'view'>

export function HTML({ ...props }: HTML) {
	return <html {...props} /> 
}

export function Body({ ...props }: Body) {
	return <body {...props} />
}

export function Title({ ...props }: Title) {
	return <title {...props} /> 
}

export function Base({ ...props }: Base) {
	return <base {...props} />
}

export function Link({ ...props }: Link) {
	return <link {...props} />
}

export function Meta({ ...props }: Meta) {
	return <meta {...props} />
}

export function Style({ ...props }: Style) {
	return <style {...props} />
}

export function Address({ ...props }: Address) {
	return <address {...props} />
}

export function Article({ ...props }: Article) {
	return <article {...props} />
}

export function Aside({ ...props }: Aside) {
	return <aside {...props} />
}

export function Footer({ ...props }: Footer) {
	return <footer {...props} />
}

export function Header({ ...props }: Header) {
	return <header {...props} />
}

export function Main({ ...props }: Main) {
	return <main {...props} />
}

export function Nav({ ...props }: Nav) {
	return <nav {...props} />
}

export function Section({ ...props }: Section) {
	return <section {...props} />
}

export function Blockquote({ ...props }: Blockquote) {
	return <blockquote {...props} />
}

export function DD({ ...props }: DD) {
	return <dd {...props} />
}

export function Div({ ...props }: Div) {
	return <div {...props} />
}

export function DL({ ...props }: DL) {
	return <dl {...props} />
}

export function DT({ ...props }: DT) {
	return <dt {...props} />
}

export function Figcaption({ ...props }: Figcaption) {
	return <figcaption {...props} />
}

export function Figure({ ...props }: Figure) {
	return <figure {...props} />
}

export function HR({ ...props }: HR) {
	return <hr {...props} />
}

export function Menu({ ...props }: Menu) {
	return <menu {...props} />
}

export function List({ ...props }: List) {
	return <li {...props} />
}

export function OrderedList({ ...props }: OrderedList) {
	return <ol {...props} />
}

export function UnorderedList({ ...props }: UnorderedList) {
	return <ul {...props} />
}

export function Pre({ ...props }: Pre) {
	return <pre {...props} />
}
export function A({ ...props }: A) {
	return <a {...props} />
}

export function Abbr({ ...props }: Abbr) {
	return <abbr {...props} />
}

export function B({ ...props }: B) {
	return <b {...props} />
}

export function BDI({ ...props }: BDI) {
	return <bdi {...props} />
}

export function BDO({ ...props }: BDO) {
	return <bdo {...props} />
}

export function Break({ ...props }: Break) {
	return <br {...props} />
}

export function Cite({ ...props }: Cite) {
	return <cite {...props} />
}

export function Code({ ...props }: Code) {
	return <code {...props} />
}

export function Data({ ...props }: Data) {
	return <data {...props} />
}

export function Del({ ...props }: Del) {
	return <del {...props} />
}

export function Dfn({ ...props }: Dfn) {
	return <dfn {...props} />
}

export function Em({ ...props }: Em) {
	return <em {...props} />
}

export function I({ ...props }: I) {
	return <i {...props} />
}

export function Ins({ ...props }: Ins) {
	return <ins {...props} />
}

export function Kbd({ ...props }: Kbd) {
	return <kbd {...props} />
}

export function Mark({ ...props }: Mark) {
	return <mark {...props} />
}

export function Q({ ...props }: Q) {
	return <q {...props} />
}

export function RP({ ...props }: RP) {
	return <rp {...props} />
}

export function RT({ ...props }: RT) {
	return <rt {...props} />
}

export function Ruby({ ...props }: Ruby) {
	return <ruby {...props} />
}

export function S({ ...props }: S) {
	return <s {...props} />
}

export function Samp({ ...props }: Samp) {
	return <samp {...props} />
}

export function Small({ ...props }: Small) {
	return <small {...props} />
}

export function Span({ ...props }: Span) {
	return <span {...props} />
}

export function Strong({ ...props }: Strong) {
	return <strong {...props} />
}

export function Sub({ ...props }: Sub) {
	return <sub {...props} />
}

export function Sup({ ...props }: Sup) {
	return <sup {...props} />
}

export function Time({ ...props }: Time) {
	return <time {...props} />
}

export function U({ ...props }: U) {
	return <u {...props} />
}

export function Var({ ...props }: Var) {
	return <var {...props} />
}

export function WBR({ ...props }: WBR) {
	return <wbr {...props} />
}
export function Area({ ...props }: Area) {
	return <area {...props} />
}

export function Audio({ ...props }: Audio) {
	return <audio {...props} />
}

export function Map({ ...props }: Map) {
	return <map {...props} />
}

export function Track({ ...props }: Track) {
	return <track {...props} />
}

export function Video({ ...props }: Video) {
	return <video {...props} />
}

export function Embed({ ...props }: Embed) {
	return <embed {...props} />
}

export function IFrame({ ...props }: IFrame) {
	return <iframe {...props} />
}

export function Object({ ...props }: Object) {
	return <object {...props} />
}

export function Param({ ...props }: Param) {
	return <param {...props} />
}

export function Picture({ ...props }: Picture) {
	return <picture {...props} />
}

export function Source({ ...props }: Source) {
	return <source {...props} />
}

export function Canvas({ ...props }: Canvas) {
	return <canvas {...props} />
}

export function NoScript({ ...props }: NoScript) {
	return <noscript {...props} />
}

export function Script({ ...props }: Script) {
	return <script {...props} />
}

export function Caption({ ...props }: Caption) {
	return <caption {...props} />
}

export function Col({ ...props }: Col) {
	return <col {...props} />
}

export function ColGroup({ ...props }: ColGroup) {
	return <colgroup {...props} />
}

export function Table({ ...props }: Table) {
	return <table {...props} />
}

export function TBody({ ...props }: TBody) {
	return <tbody {...props} />
}

export function TD({ ...props }: TD) {
	return <td {...props} />
}

export function TFoot({ ...props }: TFoot) {
	return <tfoot {...props} />
}

export function TH({ ...props }: TH) {
	return <th {...props} />
}

export function THead({ ...props }: THead) {
	return <thead {...props} />
}

export function TR({ ...props }: TR) {
	return <tr {...props} />
}

export function DataList({ ...props }: DataList) {
	return <datalist {...props} />
}

export function Dialog({ ...props }: Dialog) {
	return <dialog {...props} />
}

export function Summary({ ...props }: Summary) {
	return <summary {...props} />
}

export function Slot({ ...props }: Slot) {
	return <slot {...props} />
}

export function Template({ ...props }: Template) {
	return <template {...props} />
}
export function SVG({ ...props }: SVG) {
	return <svg {...props} />
}

export function Animate({ ...props }: Animate) {
	return <animate {...props} />
}

export function AnimateMotion({ ...props }: AnimateMotion) {
	return <animateMotion {...props} />
}

export function AnimateTransform({ ...props }: AnimateTransform) {
	return <animateTransform {...props} />
}

export function Circle({ ...props }: Circle) {
	return <circle {...props} />
}

export function ClipPath({ ...props }: ClipPath) {
	return <clipPath {...props} />
}

export function Defs({ ...props }: Defs) {
	return <defs {...props} />
}

export function Desc({ ...props }: Desc) {
	return <desc {...props} />
}

export function Ellipse({ ...props }: Ellipse) {
	return <ellipse {...props} />
}

export function FEBlend({ ...props }: FEBlend) {
	return <feBlend {...props} />
}

export function FEColorMatrix({ ...props }: FEColorMatrix) {
	return <feColorMatrix {...props} />
}

export function FEComponentTransfer({ ...props }: FEComponentTransfer) {
	return <feComponentTransfer {...props} />
}

export function FEComposite({ ...props }: FEComposite) {
	return <feComposite {...props} />
}

export function FEConvolveMatrix({ ...props }: FEConvolveMatrix) {
	return <feConvolveMatrix {...props} />
}

export function FEDiffuseLighting({ ...props }: FEDiffuseLighting) {
	return <feDiffuseLighting {...props} />
}

export function FEDisplacementMap({ ...props }: FEDisplacementMap) {
	return <feDisplacementMap {...props} />
}

export function FEDistantLight({ ...props }: FEDistantLight) {
	return <feDistantLight {...props} />
}

export function FEDropShadow({ ...props }: FEDropShadow) {
	return <feDropShadow {...props} />
}

export function FEFlood({ ...props }: FEFlood) {
	return <feFlood {...props} />
}

export function FEFuncA({ ...props }: FEFuncA) {
	return <feFuncA {...props} />
}

export function FEFuncB({ ...props }: FEFuncB) {
	return <feFuncB {...props} />
}

export function FEFuncG({ ...props }: FEFuncG) {
	return <feFuncG {...props} />
}

export function FEFuncR({ ...props }: FEFuncR) {
	return <feFuncR {...props} />
}

export function FEGaussianBlur({ ...props }: FEGaussianBlur) {
	return <feGaussianBlur {...props} />
}

export function FEImage({ ...props }: FEImage) {
	return <feImage {...props} />
}

export function FEMerge({ ...props }: FEMerge) {
	return <feMerge {...props} />
}

export function FEMergeNode({ ...props }: FEMergeNode) {
	return <feMergeNode {...props} />
}

export function FEMorphology({ ...props }: FEMorphology) {
	return <feMorphology {...props} />
}

export function FEOffset({ ...props }: FEOffset) {
	return <feOffset {...props} />
}

export function FEPointLight({ ...props }: FEPointLight) {
	return <fePointLight {...props} />
}

export function FESpecularLighting({ ...props }: FESpecularLighting) {
	return <feSpecularLighting {...props} />
}

export function FESpotLight({ ...props }: FESpotLight) {
	return <feSpotLight {...props} />
}

export function FETile({ ...props }: FETile) {
	return <feTile {...props} />
}

export function FETurbulence({ ...props }: FETurbulence) {
	return <feTurbulence {...props} />
}

export function Filter({ ...props }: Filter) {
	return <filter {...props} />
}

export function ForeignObject({ ...props }: ForeignObject) {
	return <foreignObject {...props} />
}

export function G({ ...props }: G) {
	return <g {...props} />
}

export function Image({ ...props }: Image) {
	return <image {...props} />
}

export function Line({ ...props }: Line) {
	return <line {...props} />
}

export function LinearGradient({ ...props }: LinearGradient) {
	return <linearGradient {...props} />
}

export function Marker({ ...props }: Marker) {
	return <marker {...props} />
}

export function Mask({ ...props }: Mask) {
	return <mask {...props} />
}

export function Metadata({ ...props }: Metadata) {
	return <metadata {...props} />
}

export function MPath({ ...props }: MPath) {
	return <mpath {...props} />
}

export function Path({ ...props }: Path) {
	return <path {...props} />
}

export function Pattern({ ...props }: Pattern) {
	return <pattern {...props} />
}

export function Polygon({ ...props }: Polygon) {
	return <polygon {...props} />
}

export function Polyline({ ...props }: Polyline) {
	return <polyline {...props} />
}

export function RadialGradient({ ...props }: RadialGradient) {
	return <radialGradient {...props} />
}

export function Rect({ ...props }: Rect) {
	return <rect {...props} />
}

export function Set({ ...props }: Set) {
	return <set {...props} />
}

export function Stop({ ...props }: Stop) {
	return <stop {...props} />
}

export function Switch({ ...props }: Switch) {
	return <switch {...props} />
}

export function Symbol({ ...props }: Symbol) {
	return <symbol {...props} />
}

export function Text({ ...props }: Text) {
	return <text {...props} />
}

export function TextPath({ ...props }: TextPath) {
	return <textPath {...props} />
}

export function TSpan({ ...props }: TSpan) {
	return <tspan {...props} />
}

export function Use({ ...props }: Use) {
	return <use {...props} />
}

export function View({ ...props }: View) {
	return <view {...props} />
}
