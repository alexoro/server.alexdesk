/**
 * Created by UAS on 30.04.2014.
 */

"use strict";

var data = [
    ['ab', 1],
    ['aa', 2],
    ['af', 3],
    ['ak', 4],
    ['sq', 5],
    ['am', 6],
    ['ar', 7],
    ['an', 8],
    ['hy', 9],
    ['as', 10],
    ['av', 11],
    ['ae', 12],
    ['ay', 13],
    ['az', 14],
    ['bm', 15],
    ['ba', 16],
    ['eu', 17],
    ['be', 18],
    ['bn', 19],
    ['bh', 20],
    ['bi', 21],
    ['bs', 22],
    ['br', 23],
    ['bg', 24],
    ['my', 25],
    ['ca', 26],
    ['ch', 27],
    ['ce', 28],
    ['ny', 29],
    ['zh', 30],
    ['cv', 31],
    ['kw', 32],
    ['co', 33],
    ['cr', 34],
    ['hr', 35],
    ['cs', 36],
    ['da', 37],
    ['dv', 38],
    ['nl', 39],
    ['dz', 40],
    ['en', 41],
    ['eo', 42],
    ['et', 43],
    ['ee', 44],
    ['fo', 45],
    ['fj', 46],
    ['fi', 47],
    ['fr', 48],
    ['ff', 49],
    ['gl', 50],
    ['ka', 51],
    ['de', 52],
    ['el', 53],
    ['gn', 54],
    ['gu', 55],
    ['ht', 56],
    ['ha', 57],
    ['he', 58],
    ['hz', 59],
    ['hi', 60],
    ['ho', 61],
    ['hu', 62],
    ['ia', 63],
    ['id', 64],
    ['ie', 65],
    ['ga', 66],
    ['ig', 67],
    ['ik', 68],
    ['io', 69],
    ['is', 70],
    ['it', 71],
    ['iu', 72],
    ['ja', 73],
    ['jv', 74],
    ['kl', 75],
    ['kn', 76],
    ['kr', 77],
    ['ks', 78],
    ['kk', 79],
    ['km', 80],
    ['ki', 81],
    ['rw', 82],
    ['ky', 83],
    ['kv', 84],
    ['kg', 85],
    ['ko', 86],
    ['ku', 87],
    ['kj', 88],
    ['la', 89],
    ['lb', 90],
    ['lg', 91],
    ['li', 92],
    ['ln', 93],
    ['lo', 94],
    ['lt', 95],
    ['lu', 96],
    ['lv', 97],
    ['gv', 98],
    ['mk', 99],
    ['mg', 100],
    ['ms', 101],
    ['ml', 102],
    ['mt', 103],
    ['mi', 104],
    ['mr', 105],
    ['mh', 106],
    ['mn', 107],
    ['na', 108],
    ['nv', 109],
    ['nb', 110],
    ['nd', 111],
    ['ne', 112],
    ['ng', 113],
    ['nn', 114],
    ['no', 115],
    ['ii', 116],
    ['nr', 117],
    ['oc', 118],
    ['oj', 119],
    ['cu', 120],
    ['om', 121],
    ['or', 122],
    ['os', 123],
    ['pa', 124],
    ['pi', 125],
    ['fa', 126],
    ['pl', 127],
    ['ps', 128],
    ['pt', 129],
    ['qu', 130],
    ['rm', 131],
    ['rn', 132],
    ['ro', 133],
    ['ru', 134],
    ['sa', 135],
    ['sc', 136],
    ['sd', 137],
    ['se', 138],
    ['sm', 139],
    ['sg', 140],
    ['sr', 141],
    ['gd', 142],
    ['sn', 143],
    ['si', 144],
    ['sk', 145],
    ['sl', 146],
    ['so', 147],
    ['st', 148],
    ['es', 149],
    ['su', 150],
    ['sw', 151],
    ['ss', 152],
    ['sv', 153],
    ['ta', 154],
    ['te', 155],
    ['tg', 156],
    ['th', 157],
    ['ti', 158],
    ['bo', 159],
    ['tk', 160],
    ['tl', 161],
    ['tn', 162],
    ['to', 163],
    ['tr', 164],
    ['ts', 165],
    ['tt', 166],
    ['tw', 167],
    ['ty', 168],
    ['ug', 169],
    ['uk', 170],
    ['ur', 171],
    ['uz', 172],
    ['ve', 173],
    ['vi', 174],
    ['vo', 175],
    ['wa', 176],
    ['cy', 177],
    ['wo', 178],
    ['fy', 179],
    ['xh', 180],
    ['yi', 181],
    ['yo', 182],
    ['za', 183],
    ['zu', 184]
];


var code2id = null;
var id2code = null;

for(var i in data) {
    code2id[data[i][0]] = data[i][1];
    id2code[data[i][1]] = data[i][0];
}

module.exports = {
    getIdByCode: function(code2) {
        var r = code2id[code2];
        if (r) {
            return r;
        } else {
            return 0;
        }
    },

    getCodeById: function(id) {
        var r = id2code[id];
        if (r) {
            return r;
        } else {
            return null;
        }
    }
};