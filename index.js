let fs = require('fs');
let voice = fs.readFileSync('./test.wav');
let voiceBuffer = new Buffer(voice);

var AipSpeechClient = require("baidu-aip-sdk").speech

// 设置APPID/AK/SK
var APP_ID = "5048556"
var API_KEY = "k0WwiyfAKcfQawujSUwApLcF"
var SECRET_KEY = "sm9TZpN32XdrLKk0QhaBkrsmXUVxo5Rf"

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY)

const _ = require('lodash')

const record = require('node-record-lpcm16')
const Detector = require('snowboy').Detector
const Models = require('snowboy').Models

const models = new Models()

models.add({
  file: './laotie.pmdl',
  sensitivity: '0.5',
  hotwords : '老铁'
})

const detector = new Detector({
  resource: './resources/common.res',
  audioGain: 2.0,
  applyFrontend: true,
  models,
})

detector.on('silence', function () {
  // console.log('silence')
})

detector.on('sound', function (buffer) {
  // console.log('sound')
})

detector.on('error', function () {
  console.log('error')
})

detector.on('hotword', function (index, hotword, buffer) {
  console.log(buffer)
  // 识别本地文件
  client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
      console.log('<recognize>: ' + JSON.stringify(result))
  }, function(err) {
      console.log(err)
  })
})

const mic = record.start({
  sampleRate: 16000,
  threshold: 0,
  verbose: true
})

mic.pipe(detector)


function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex')
}
