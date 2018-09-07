((arg1) => {
    var_dump(arg1);
    ((arg2) => {
        var_dump(arg2);
    })("world!");
})("Hello");