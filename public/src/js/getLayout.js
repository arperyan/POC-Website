function getLayout(model, callbackFn, elementId){
  model.getLayout().then(layout=>{
    layouts[elementId] = layout;
    callbackFn.call(null, elementId, layout, model)
  });
}
