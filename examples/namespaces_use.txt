module 'math' {

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

import {Formula as Formula1, Hello} from 'math';
Formula1.do_something();
Hello.do_something();
