import {GuideTitleStyle, zero, one} from './constants';
import guideMark from './guide-mark';
import {lookup, alignExpr, anchorExpr} from './guide-util';
import {TextMark} from '../marks/marktypes';
import {LegendTitleRole} from '../marks/roles';
import {addEncoders} from '../encode/encode-util';

// expression logic for align, anchor, angle, and baseline calculation
const isL = 'item.orient === "left"',
      isR = 'item.orient === "right"',
      isLR = `(${isL} || ${isR})`,
      isVG = `datum.vgrad && ${isLR}`,
      baseline = anchorExpr('"top"', '"bottom"', '"middle"'),
      alignFlip = anchorExpr('"right"', '"left"', '"center"'),
      exprAlign = `datum.vgrad && ${isR} ? (${alignFlip}) : (${isLR} && !(datum.vgrad && ${isL})) ? "left" : ${alignExpr}`,
      exprAnchor = `item._anchor || (${isLR} ? "middle" : "start")`,
      exprAngle = `${isVG} ? (${isL} ? -90 : 90) : 0`,
      exprBaseline = `${isLR} ? (datum.vgrad ? (${isR} ? "bottom" : "top") : ${baseline}) : "top"`;

export default function(spec, config, userEncode, dataRef) {
  var _ = lookup(spec, config), encode;

  encode = {
    enter: {opacity: zero},
    update: {
      opacity: one,
      x: {field: {group: 'padding'}},
      y: {field: {group: 'padding'}}
    },
    exit: {opacity: zero}
  };

  addEncoders(encode, {
    orient:      _('titleOrient'),
    _anchor:     _('titleAnchor'),
    anchor:      {signal: exprAnchor},
    angle:       {signal: exprAngle},
    align:       {signal: exprAlign},
    baseline:    {signal: exprBaseline},
    text:        spec.title,
    fill:        _('titleColor'),
    fillOpacity: _('titleOpacity'),
    font:        _('titleFont'),
    fontSize:    _('titleFontSize'),
    fontStyle:   _('titleFontStyle'),
    fontWeight:  _('titleFontWeight'),
    limit:       _('titleLimit')
  }, { // require update
    align:       _('titleAlign'),
    baseline:    _('titleBaseline'),
  });

  return guideMark(TextMark, LegendTitleRole, GuideTitleStyle, null, dataRef, encode, userEncode);
}
