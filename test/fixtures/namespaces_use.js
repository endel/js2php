module 'math.formulas' {

  class Formula {
    constructor() {
    }

    static do_something() {
      var_dump("Something!")
    }
  }

  class Hello {
    static do_something() {
      var_dump("Something!");
    }
  }

  export function sum(x, y) {
    return x + y;
  }
  export var pi = 3.141593;
}

// use Gregwar\Captcha\CaptchaBuilder;
import {Formula as Formula1, Hello} from 'math.formulas';
Formula1.do_something();
Hello.do_something();
