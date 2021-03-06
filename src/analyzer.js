// 验证分析
function Analyzer (validator) {

  // console.log(validator)
  var that = this
  this.valider = function () {
    return validator
  }
  this.errors = null
  this.msgs = []
  // 代理
  // return new Proxy(validator.results, {
  //   get (target, key) {
  //     // 优先访问results
  //     if (target[key]) {
  //       return target[key]
  //     } else {
  //       return that[key]
  //     }
  //   }
  // })
}
Analyzer.prototype.parseMsg = function (msg) {
  return msg
}
Analyzer.prototype.fails = function () {
  return this.valider().count > 0
}
Analyzer.prototype.all = function (isArr) {
  if (!this.errors) {
    this.errors = {}
    for (let field in this.valider().results) {
      this.errors[field] = this.get(field)
    }
  }
  if (isArr) {
    var err = []
    for (let field in this.errors) {
      if (this.errors[field].length > 0) {
        for (var i in this.errors[field]) {
          err.push(this.errors[field][i])
        }
      }
    }
    return err
  } else {
    return this.errors
  }
}

Analyzer.prototype.get = function (field, isOrign) {
  var result = this.valider().results[field]
  if (!result) {
    console.warn('The field does not exist in constraints')
    return []
  }
  if (isOrign) {
    return result
  }
  // 当需要验证数据不存在此字段并且不必须的字段时，返回[]
  if (this.valider().data[field] === undefined) {
    // 不提供required验证情况
    if (!result.hasOwnProperty('required')) {
      return []
    }
    // 存在required验证情况
    if (result.hasOwnProperty('required') && result.required.result) {
      return []
    }
  }
  var msg = []
  for (let type in result) {
    if (!result[type].result) {
      msg.push(this.parseMsg(result[type].msg))
    }
  }
  return msg
}
Analyzer.prototype.has = function (field) {
  return this.get(field).length > 0
}
Analyzer.prototype.first = function (field) {
  if (field) {
    return this.get(field)[0]
  }
  if (!this.errors) {
    this.all()
  }
  for (let field in this.errors) {
    if (this.errors[field].length > 0) {
      return this.errors[field][0]
    }
  }
}
Analyzer.prototype.last = function (field) {
  var msgs = this.get(field)
  return msgs[msgs.length - 1]
}

export default Analyzer
