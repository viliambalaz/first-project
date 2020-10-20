(function(factory){if(typeof define==="function"&&define.amd){define(["../datepicker"],factory);}else{factory(jQuery.datepicker);}}(function(datepicker){datepicker.regional['sk']={closeText:'Zavrieť',prevText:'&#x3C;Predchádzajúci',nextText:'Nasledujúci&#x3E;',currentText:'Dnes',monthNames:['január','február','marec','apríl','máj','jún','júl','august','september','október','november','december'],monthNamesShort:['Jan','Feb','Mar','Apr','Máj','Jún','Júl','Aug','Sep','Okt','Nov','Dec'],dayNames:['nedeľa','pondelok','utorok','streda','štvrtok','piatok','sobota'],dayNamesShort:['Ned','Pon','Uto','Str','Štv','Pia','Sob'],dayNamesMin:['Ne','Po','Ut','St','Št','Pia','So'],weekHeader:'Ty',dateFormat:'dd.mm.yy',firstDay:1,isRTL:false,showMonthAfterYear:false,yearSuffix:''};datepicker.setDefaults(datepicker.regional['sk']);return datepicker.regional['sk'];}));(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else{factory(window.jQuery);}}(function($){'use strict';var counter=0;$.ajaxTransport('iframe',function(options){if(options.async){var initialIframeSrc=options.initialIframeSrc||'javascript:false;',form,iframe,addParamChar;return{send:function(_,completeCallback){form=$('<form style="display:none;"></form>');form.attr('accept-charset',options.formAcceptCharset);addParamChar=/\?/.test(options.url)?'&':'?';if(options.type==='DELETE'){options.url=options.url+addParamChar+'_method=DELETE';options.type='POST';}else if(options.type==='PUT'){options.url=options.url+addParamChar+'_method=PUT';options.type='POST';}else if(options.type==='PATCH'){options.url=options.url+addParamChar+'_method=PATCH';options.type='POST';}
counter+=1;iframe=$('<iframe src="'+initialIframeSrc+'" name="iframe-transport-'+counter+'"></iframe>').bind('load',function(){var fileInputClones,paramNames=$.isArray(options.paramName)?options.paramName:[options.paramName];iframe.unbind('load').bind('load',function(){var response;try{response=iframe.contents();if(!response.length||!response[0].firstChild){throw new Error();}}catch(e){response=undefined;}
completeCallback(200,'success',{'iframe':response});$('<iframe src="'+initialIframeSrc+'"></iframe>').appendTo(form);window.setTimeout(function(){form.remove();},0);});form.prop('target',iframe.prop('name')).prop('action',options.url).prop('method',options.type);if(options.formData){$.each(options.formData,function(index,field){$('<input type="hidden"/>').prop('name',field.name).val(field.value).appendTo(form);});}
if(options.fileInput&&options.fileInput.length&&options.type==='POST'){fileInputClones=options.fileInput.clone();options.fileInput.after(function(index){return fileInputClones[index];});if(options.paramName){options.fileInput.each(function(index){$(this).prop('name',paramNames[index]||options.paramName);});}
form.append(options.fileInput).prop('enctype','multipart/form-data').prop('encoding','multipart/form-data');options.fileInput.removeAttr('form');}
form.submit();if(fileInputClones&&fileInputClones.length){options.fileInput.each(function(index,input){var clone=$(fileInputClones[index]);$(input).prop('name',clone.prop('name')).attr('form',clone.attr('form'));clone.replaceWith(input);});}});form.append(iframe).appendTo(document.body);},abort:function(){if(iframe){iframe.unbind('load').prop('src',initialIframeSrc);}
if(form){form.remove();}}};}});$.ajaxSetup({converters:{'iframe text':function(iframe){return iframe&&$(iframe[0].body).text();},'iframe json':function(iframe){return iframe&&$.parseJSON($(iframe[0].body).text());},'iframe html':function(iframe){return iframe&&$(iframe[0].body).html();},'iframe xml':function(iframe){var xmlDoc=iframe&&iframe[0];return xmlDoc&&$.isXMLDoc(xmlDoc)?xmlDoc:$.parseXML((xmlDoc.XMLDocument&&xmlDoc.XMLDocument.xml)||$(xmlDoc.body).html());},'iframe script':function(iframe){return iframe&&$.globalEval($(iframe[0].body).text());}}});}));(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery','jquery.ui.widget'],factory);}else{factory(window.jQuery);}}(function($){'use strict';$.support.fileInput=!(new RegExp('(Android (1\\.[0156]|2\\.[01]))'+'|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)'+'|(w(eb)?OSBrowser)|(webOS)'+'|(Kindle/(1\\.0|2\\.[05]|3\\.0))').test(window.navigator.userAgent)||$('<input type="file">').prop('disabled'));$.support.xhrFileUpload=!!(window.ProgressEvent&&window.FileReader);$.support.xhrFormDataFileUpload=!!window.FormData;$.support.blobSlice=window.Blob&&(Blob.prototype.slice||Blob.prototype.webkitSlice||Blob.prototype.mozSlice);function getDragHandler(type){var isDragOver=type==='dragover';return function(e){e.dataTransfer=e.originalEvent&&e.originalEvent.dataTransfer;var dataTransfer=e.dataTransfer;if(dataTransfer&&$.inArray('Files',dataTransfer.types)!==-1&&this._trigger(type,$.Event(type,{delegatedEvent:e}))!==false){e.preventDefault();if(isDragOver){dataTransfer.dropEffect='copy';}}};}
$.widget('blueimp.fileupload',{options:{dropZone:$(document),pasteZone:$(document),fileInput:undefined,replaceFileInput:true,paramName:undefined,singleFileUploads:true,limitMultiFileUploads:undefined,limitMultiFileUploadSize:undefined,limitMultiFileUploadSizeOverhead:512,sequentialUploads:false,limitConcurrentUploads:undefined,forceIframeTransport:false,redirect:undefined,redirectParamName:undefined,postMessage:undefined,multipart:true,maxChunkSize:undefined,uploadedBytes:undefined,recalculateProgress:true,progressInterval:100,bitrateInterval:500,autoUpload:true,messages:{uploadedBytes:'Uploaded bytes exceed file size'},i18n:function(message,context){message=this.messages[message]||message.toString();if(context){$.each(context,function(key,value){message=message.replace('{'+key+'}',value);});}
return message;},formData:function(form){return form.serializeArray();},add:function(e,data){if(e.isDefaultPrevented()){return false;}
if(data.autoUpload||(data.autoUpload!==false&&$(this).fileupload('option','autoUpload'))){data.process().done(function(){data.submit();});}},processData:false,contentType:false,cache:false},_specialOptions:['fileInput','dropZone','pasteZone','multipart','forceIframeTransport'],_blobSlice:$.support.blobSlice&&function(){var slice=this.slice||this.webkitSlice||this.mozSlice;return slice.apply(this,arguments);},_BitrateTimer:function(){this.timestamp=((Date.now)?Date.now():(new Date()).getTime());this.loaded=0;this.bitrate=0;this.getBitrate=function(now,loaded,interval){var timeDiff=now-this.timestamp;if(!this.bitrate||!interval||timeDiff>interval){this.bitrate=(loaded-this.loaded)*(1000/timeDiff)*8;this.loaded=loaded;this.timestamp=now;}
return this.bitrate;};},_isXHRUpload:function(options){return!options.forceIframeTransport&&((!options.multipart&&$.support.xhrFileUpload)||$.support.xhrFormDataFileUpload);},_getFormData:function(options){var formData;if($.type(options.formData)==='function'){return options.formData(options.form);}
if($.isArray(options.formData)){return options.formData;}
if($.type(options.formData)==='object'){formData=[];$.each(options.formData,function(name,value){formData.push({name:name,value:value});});return formData;}
return[];},_getTotal:function(files){var total=0;$.each(files,function(index,file){total+=file.size||1;});return total;},_initProgressObject:function(obj){var progress={loaded:0,total:0,bitrate:0};if(obj._progress){$.extend(obj._progress,progress);}else{obj._progress=progress;}},_initResponseObject:function(obj){var prop;if(obj._response){for(prop in obj._response){if(obj._response.hasOwnProperty(prop)){delete obj._response[prop];}}}else{obj._response={};}},_onProgress:function(e,data){if(e.lengthComputable){var now=((Date.now)?Date.now():(new Date()).getTime()),loaded;if(data._time&&data.progressInterval&&(now-data._time<data.progressInterval)&&e.loaded!==e.total){return;}
data._time=now;loaded=Math.floor(e.loaded/e.total*(data.chunkSize||data._progress.total))+(data.uploadedBytes||0);this._progress.loaded+=(loaded-data._progress.loaded);this._progress.bitrate=this._bitrateTimer.getBitrate(now,this._progress.loaded,data.bitrateInterval);data._progress.loaded=data.loaded=loaded;data._progress.bitrate=data.bitrate=data._bitrateTimer.getBitrate(now,loaded,data.bitrateInterval);this._trigger('progress',$.Event('progress',{delegatedEvent:e}),data);this._trigger('progressall',$.Event('progressall',{delegatedEvent:e}),this._progress);}},_initProgressListener:function(options){var that=this,xhr=options.xhr?options.xhr():$.ajaxSettings.xhr();if(xhr.upload){$(xhr.upload).bind('progress',function(e){var oe=e.originalEvent;e.lengthComputable=oe.lengthComputable;e.loaded=oe.loaded;e.total=oe.total;that._onProgress(e,options);});options.xhr=function(){return xhr;};}},_isInstanceOf:function(type,obj){return Object.prototype.toString.call(obj)==='[object '+type+']';},_initXHRData:function(options){var that=this,formData,file=options.files[0],multipart=options.multipart||!$.support.xhrFileUpload,paramName=$.type(options.paramName)==='array'?options.paramName[0]:options.paramName;options.headers=$.extend({},options.headers);if(options.contentRange){options.headers['Content-Range']=options.contentRange;}
if(!multipart||options.blob||!this._isInstanceOf('File',file)){options.headers['Content-Disposition']='attachment; filename="'+
encodeURI(file.name)+'"';}
if(!multipart){options.contentType=file.type||'application/octet-stream';options.data=options.blob||file;}else if($.support.xhrFormDataFileUpload){if(options.postMessage){formData=this._getFormData(options);if(options.blob){formData.push({name:paramName,value:options.blob});}else{$.each(options.files,function(index,file){formData.push({name:($.type(options.paramName)==='array'&&options.paramName[index])||paramName,value:file});});}}else{if(that._isInstanceOf('FormData',options.formData)){formData=options.formData;}else{formData=new FormData();$.each(this._getFormData(options),function(index,field){formData.append(field.name,field.value);});}
if(options.blob){formData.append(paramName,options.blob,file.name);}else{$.each(options.files,function(index,file){if(that._isInstanceOf('File',file)||that._isInstanceOf('Blob',file)){formData.append(($.type(options.paramName)==='array'&&options.paramName[index])||paramName,file,file.uploadName||file.name);}});}}
options.data=formData;}
options.blob=null;},_initIframeSettings:function(options){var targetHost=$('<a></a>').prop('href',options.url).prop('host');options.dataType='iframe '+(options.dataType||'');options.formData=this._getFormData(options);if(options.redirect&&targetHost&&targetHost!==location.host){options.formData.push({name:options.redirectParamName||'redirect',value:options.redirect});}},_initDataSettings:function(options){if(this._isXHRUpload(options)){if(!this._chunkedUpload(options,true)){if(!options.data){this._initXHRData(options);}
this._initProgressListener(options);}
if(options.postMessage){options.dataType='postmessage '+(options.dataType||'');}}else{this._initIframeSettings(options);}},_getParamName:function(options){var fileInput=$(options.fileInput),paramName=options.paramName;if(!paramName){paramName=[];fileInput.each(function(){var input=$(this),name=input.prop('name')||'files[]',i=(input.prop('files')||[1]).length;while(i){paramName.push(name);i-=1;}});if(!paramName.length){paramName=[fileInput.prop('name')||'files[]'];}}else if(!$.isArray(paramName)){paramName=[paramName];}
return paramName;},_initFormSettings:function(options){if(!options.form||!options.form.length){options.form=$(options.fileInput.prop('form'));if(!options.form.length){options.form=$(this.options.fileInput.prop('form'));}}
options.paramName=this._getParamName(options);if(!options.url){options.url=options.form.prop('action')||location.href;}
options.type=(options.type||($.type(options.form.prop('method'))==='string'&&options.form.prop('method'))||'').toUpperCase();if(options.type!=='POST'&&options.type!=='PUT'&&options.type!=='PATCH'){options.type='POST';}
if(!options.formAcceptCharset){options.formAcceptCharset=options.form.attr('accept-charset');}},_getAJAXSettings:function(data){var options=$.extend({},this.options,data);this._initFormSettings(options);this._initDataSettings(options);return options;},_getDeferredState:function(deferred){if(deferred.state){return deferred.state();}
if(deferred.isResolved()){return'resolved';}
if(deferred.isRejected()){return'rejected';}
return'pending';},_enhancePromise:function(promise){promise.success=promise.done;promise.error=promise.fail;promise.complete=promise.always;return promise;},_getXHRPromise:function(resolveOrReject,context,args){var dfd=$.Deferred(),promise=dfd.promise();context=context||this.options.context||promise;if(resolveOrReject===true){dfd.resolveWith(context,args);}else if(resolveOrReject===false){dfd.rejectWith(context,args);}
promise.abort=dfd.promise;return this._enhancePromise(promise);},_addConvenienceMethods:function(e,data){var that=this,getPromise=function(args){return $.Deferred().resolveWith(that,args).promise();};data.process=function(resolveFunc,rejectFunc){if(resolveFunc||rejectFunc){data._processQueue=this._processQueue=(this._processQueue||getPromise([this])).pipe(function(){if(data.errorThrown){return $.Deferred().rejectWith(that,[data]).promise();}
return getPromise(arguments);}).pipe(resolveFunc,rejectFunc);}
return this._processQueue||getPromise([this]);};data.submit=function(){if(this.state()!=='pending'){data.jqXHR=this.jqXHR=(that._trigger('submit',$.Event('submit',{delegatedEvent:e}),this)!==false)&&that._onSend(e,this);}
return this.jqXHR||that._getXHRPromise();};data.abort=function(){if(this.jqXHR){return this.jqXHR.abort();}
this.errorThrown='abort';that._trigger('fail',null,this);return that._getXHRPromise(false);};data.state=function(){if(this.jqXHR){return that._getDeferredState(this.jqXHR);}
if(this._processQueue){return that._getDeferredState(this._processQueue);}};data.processing=function(){return!this.jqXHR&&this._processQueue&&that._getDeferredState(this._processQueue)==='pending';};data.progress=function(){return this._progress;};data.response=function(){return this._response;};},_getUploadedBytes:function(jqXHR){var range=jqXHR.getResponseHeader('Range'),parts=range&&range.split('-'),upperBytesPos=parts&&parts.length>1&&parseInt(parts[1],10);return upperBytesPos&&upperBytesPos+1;},_chunkedUpload:function(options,testOnly){options.uploadedBytes=options.uploadedBytes||0;var that=this,file=options.files[0],fs=file.size,ub=options.uploadedBytes,mcs=options.maxChunkSize||fs,slice=this._blobSlice,dfd=$.Deferred(),promise=dfd.promise(),jqXHR,upload;if(!(this._isXHRUpload(options)&&slice&&(ub||mcs<fs))||options.data){return false;}
if(testOnly){return true;}
if(ub>=fs){file.error=options.i18n('uploadedBytes');return this._getXHRPromise(false,options.context,[null,'error',file.error]);}
upload=function(){var o=$.extend({},options),currentLoaded=o._progress.loaded;o.blob=slice.call(file,ub,ub+mcs,file.type);o.chunkSize=o.blob.size;o.contentRange='bytes '+ub+'-'+
(ub+o.chunkSize-1)+'/'+fs;that._initXHRData(o);that._initProgressListener(o);jqXHR=((that._trigger('chunksend',null,o)!==false&&$.ajax(o))||that._getXHRPromise(false,o.context)).done(function(result,textStatus,jqXHR){ub=that._getUploadedBytes(jqXHR)||(ub+o.chunkSize);if(currentLoaded+o.chunkSize-o._progress.loaded){that._onProgress($.Event('progress',{lengthComputable:true,loaded:ub-o.uploadedBytes,total:ub-o.uploadedBytes}),o);}
options.uploadedBytes=o.uploadedBytes=ub;o.result=result;o.textStatus=textStatus;o.jqXHR=jqXHR;that._trigger('chunkdone',null,o);that._trigger('chunkalways',null,o);if(ub<fs){upload();}else{dfd.resolveWith(o.context,[result,textStatus,jqXHR]);}}).fail(function(jqXHR,textStatus,errorThrown){o.jqXHR=jqXHR;o.textStatus=textStatus;o.errorThrown=errorThrown;that._trigger('chunkfail',null,o);that._trigger('chunkalways',null,o);dfd.rejectWith(o.context,[jqXHR,textStatus,errorThrown]);});};this._enhancePromise(promise);promise.abort=function(){return jqXHR.abort();};upload();return promise;},_beforeSend:function(e,data){if(this._active===0){this._trigger('start');this._bitrateTimer=new this._BitrateTimer();this._progress.loaded=this._progress.total=0;this._progress.bitrate=0;}
this._initResponseObject(data);this._initProgressObject(data);data._progress.loaded=data.loaded=data.uploadedBytes||0;data._progress.total=data.total=this._getTotal(data.files)||1;data._progress.bitrate=data.bitrate=0;this._active+=1;this._progress.loaded+=data.loaded;this._progress.total+=data.total;},_onDone:function(result,textStatus,jqXHR,options){var total=options._progress.total,response=options._response;if(options._progress.loaded<total){this._onProgress($.Event('progress',{lengthComputable:true,loaded:total,total:total}),options);}
response.result=options.result=result;response.textStatus=options.textStatus=textStatus;response.jqXHR=options.jqXHR=jqXHR;this._trigger('done',null,options);},_onFail:function(jqXHR,textStatus,errorThrown,options){var response=options._response;if(options.recalculateProgress){this._progress.loaded-=options._progress.loaded;this._progress.total-=options._progress.total;}
response.jqXHR=options.jqXHR=jqXHR;response.textStatus=options.textStatus=textStatus;response.errorThrown=options.errorThrown=errorThrown;this._trigger('fail',null,options);},_onAlways:function(jqXHRorResult,textStatus,jqXHRorError,options){this._trigger('always',null,options);},_onSend:function(e,data){if(!data.submit){this._addConvenienceMethods(e,data);}
var that=this,jqXHR,aborted,slot,pipe,options=that._getAJAXSettings(data),send=function(){that._sending+=1;options._bitrateTimer=new that._BitrateTimer();jqXHR=jqXHR||(((aborted||that._trigger('send',$.Event('send',{delegatedEvent:e}),options)===false)&&that._getXHRPromise(false,options.context,aborted))||that._chunkedUpload(options)||$.ajax(options)).done(function(result,textStatus,jqXHR){that._onDone(result,textStatus,jqXHR,options);}).fail(function(jqXHR,textStatus,errorThrown){that._onFail(jqXHR,textStatus,errorThrown,options);}).always(function(jqXHRorResult,textStatus,jqXHRorError){that._onAlways(jqXHRorResult,textStatus,jqXHRorError,options);that._sending-=1;that._active-=1;if(options.limitConcurrentUploads&&options.limitConcurrentUploads>that._sending){var nextSlot=that._slots.shift();while(nextSlot){if(that._getDeferredState(nextSlot)==='pending'){nextSlot.resolve();break;}
nextSlot=that._slots.shift();}}
if(that._active===0){that._trigger('stop');}});return jqXHR;};this._beforeSend(e,options);if(this.options.sequentialUploads||(this.options.limitConcurrentUploads&&this.options.limitConcurrentUploads<=this._sending)){if(this.options.limitConcurrentUploads>1){slot=$.Deferred();this._slots.push(slot);pipe=slot.pipe(send);}else{this._sequence=this._sequence.pipe(send,send);pipe=this._sequence;}
pipe.abort=function(){aborted=[undefined,'abort','abort'];if(!jqXHR){if(slot){slot.rejectWith(options.context,aborted);}
return send();}
return jqXHR.abort();};return this._enhancePromise(pipe);}
return send();},_onAdd:function(e,data){var that=this,result=true,options=$.extend({},this.options,data),files=data.files,filesLength=files.length,limit=options.limitMultiFileUploads,limitSize=options.limitMultiFileUploadSize,overhead=options.limitMultiFileUploadSizeOverhead,batchSize=0,paramName=this._getParamName(options),paramNameSet,paramNameSlice,fileSet,i,j=0;if(limitSize&&(!filesLength||files[0].size===undefined)){limitSize=undefined;}
if(!(options.singleFileUploads||limit||limitSize)||!this._isXHRUpload(options)){fileSet=[files];paramNameSet=[paramName];}else if(!(options.singleFileUploads||limitSize)&&limit){fileSet=[];paramNameSet=[];for(i=0;i<filesLength;i+=limit){fileSet.push(files.slice(i,i+limit));paramNameSlice=paramName.slice(i,i+limit);if(!paramNameSlice.length){paramNameSlice=paramName;}
paramNameSet.push(paramNameSlice);}}else if(!options.singleFileUploads&&limitSize){fileSet=[];paramNameSet=[];for(i=0;i<filesLength;i=i+1){batchSize+=files[i].size+overhead;if(i+1===filesLength||((batchSize+files[i+1].size+overhead)>limitSize)||(limit&&i+1-j>=limit)){fileSet.push(files.slice(j,i+1));paramNameSlice=paramName.slice(j,i+1);if(!paramNameSlice.length){paramNameSlice=paramName;}
paramNameSet.push(paramNameSlice);j=i+1;batchSize=0;}}}else{paramNameSet=paramName;}
data.originalFiles=files;$.each(fileSet||files,function(index,element){var newData=$.extend({},data);newData.files=fileSet?element:[element];newData.paramName=paramNameSet[index];that._initResponseObject(newData);that._initProgressObject(newData);that._addConvenienceMethods(e,newData);result=that._trigger('add',$.Event('add',{delegatedEvent:e}),newData);return result;});return result;},_replaceFileInput:function(data){var input=data.fileInput,inputClone=input.clone(true);data.fileInputClone=inputClone;$('<form></form>').append(inputClone)[0].reset();input.after(inputClone).detach();$.cleanData(input.unbind('remove'));this.options.fileInput=this.options.fileInput.map(function(i,el){if(el===input[0]){return inputClone[0];}
return el;});if(input[0]===this.element[0]){this.element=inputClone;}},_handleFileTreeEntry:function(entry,path){var that=this,dfd=$.Deferred(),errorHandler=function(e){if(e&&!e.entry){e.entry=entry;}
dfd.resolve([e]);},successHandler=function(entries){that._handleFileTreeEntries(entries,path+entry.name+'/').done(function(files){dfd.resolve(files);}).fail(errorHandler);},readEntries=function(){dirReader.readEntries(function(results){if(!results.length){successHandler(entries);}else{entries=entries.concat(results);readEntries();}},errorHandler);},dirReader,entries=[];path=path||'';if(entry.isFile){if(entry._file){entry._file.relativePath=path;dfd.resolve(entry._file);}else{entry.file(function(file){file.relativePath=path;dfd.resolve(file);},errorHandler);}}else if(entry.isDirectory){dirReader=entry.createReader();readEntries();}else{dfd.resolve([]);}
return dfd.promise();},_handleFileTreeEntries:function(entries,path){var that=this;return $.when.apply($,$.map(entries,function(entry){return that._handleFileTreeEntry(entry,path);})).pipe(function(){return Array.prototype.concat.apply([],arguments);});},_getDroppedFiles:function(dataTransfer){dataTransfer=dataTransfer||{};var items=dataTransfer.items;if(items&&items.length&&(items[0].webkitGetAsEntry||items[0].getAsEntry)){return this._handleFileTreeEntries($.map(items,function(item){var entry;if(item.webkitGetAsEntry){entry=item.webkitGetAsEntry();if(entry){entry._file=item.getAsFile();}
return entry;}
return item.getAsEntry();}));}
return $.Deferred().resolve($.makeArray(dataTransfer.files)).promise();},_getSingleFileInputFiles:function(fileInput){fileInput=$(fileInput);var entries=fileInput.prop('webkitEntries')||fileInput.prop('entries'),files,value;if(entries&&entries.length){return this._handleFileTreeEntries(entries);}
files=$.makeArray(fileInput.prop('files'));if(!files.length){value=fileInput.prop('value');if(!value){return $.Deferred().resolve([]).promise();}
files=[{name:value.replace(/^.*\\/,'')}];}else if(files[0].name===undefined&&files[0].fileName){$.each(files,function(index,file){file.name=file.fileName;file.size=file.fileSize;});}
return $.Deferred().resolve(files).promise();},_getFileInputFiles:function(fileInput){if(!(fileInput instanceof $)||fileInput.length===1){return this._getSingleFileInputFiles(fileInput);}
return $.when.apply($,$.map(fileInput,this._getSingleFileInputFiles)).pipe(function(){return Array.prototype.concat.apply([],arguments);});},_onChange:function(e){var that=this,data={fileInput:$(e.target),form:$(e.target.form)};this._getFileInputFiles(data.fileInput).always(function(files){data.files=files;if(that.options.replaceFileInput){that._replaceFileInput(data);}
if(that._trigger('change',$.Event('change',{delegatedEvent:e}),data)!==false){that._onAdd(e,data);}});},_onPaste:function(e){var items=e.originalEvent&&e.originalEvent.clipboardData&&e.originalEvent.clipboardData.items,data={files:[]};if(items&&items.length){$.each(items,function(index,item){var file=item.getAsFile&&item.getAsFile();if(file){data.files.push(file);}});if(this._trigger('paste',$.Event('paste',{delegatedEvent:e}),data)!==false){this._onAdd(e,data);}}},_onDrop:function(e){e.dataTransfer=e.originalEvent&&e.originalEvent.dataTransfer;var that=this,dataTransfer=e.dataTransfer,data={};if(dataTransfer&&dataTransfer.files&&dataTransfer.files.length){e.preventDefault();this._getDroppedFiles(dataTransfer).always(function(files){data.files=files;if(that._trigger('drop',$.Event('drop',{delegatedEvent:e}),data)!==false){that._onAdd(e,data);}});}},_onDragOver:getDragHandler('dragover'),_onDragEnter:getDragHandler('dragenter'),_onDragLeave:getDragHandler('dragleave'),_initEventHandlers:function(){if(this._isXHRUpload(this.options)){this._on(this.options.dropZone,{dragover:this._onDragOver,drop:this._onDrop,dragenter:this._onDragEnter,dragleave:this._onDragLeave});this._on(this.options.pasteZone,{paste:this._onPaste});}
if($.support.fileInput){this._on(this.options.fileInput,{change:this._onChange});}},_destroyEventHandlers:function(){this._off(this.options.dropZone,'dragenter dragleave dragover drop');this._off(this.options.pasteZone,'paste');this._off(this.options.fileInput,'change');},_setOption:function(key,value){var reinit=$.inArray(key,this._specialOptions)!==-1;if(reinit){this._destroyEventHandlers();}
this._super(key,value);if(reinit){this._initSpecialOptions();this._initEventHandlers();}},_initSpecialOptions:function(){var options=this.options;if(options.fileInput===undefined){options.fileInput=this.element.is('input[type="file"]')?this.element:this.element.find('input[type="file"]');}else if(!(options.fileInput instanceof $)){options.fileInput=$(options.fileInput);}
if(!(options.dropZone instanceof $)){options.dropZone=$(options.dropZone);}
if(!(options.pasteZone instanceof $)){options.pasteZone=$(options.pasteZone);}},_getRegExp:function(str){var parts=str.split('/'),modifiers=parts.pop();parts.shift();return new RegExp(parts.join('/'),modifiers);},_isRegExpOption:function(key,value){return key!=='url'&&$.type(value)==='string'&&/^\/.*\/[igm]{0,3}$/.test(value);},_initDataAttributes:function(){var that=this,options=this.options,clone=$(this.element[0].cloneNode(false));$.each(clone.data(),function(key,value){var dataAttributeName='data-'+
key.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();if(clone.attr(dataAttributeName)){if(that._isRegExpOption(key,value)){value=that._getRegExp(value);}
options[key]=value;}});},_create:function(){this._initDataAttributes();this._initSpecialOptions();this._slots=[];this._sequence=this._getXHRPromise(true);this._sending=this._active=0;this._initProgressObject(this);this._initEventHandlers();},active:function(){return this._active;},progress:function(){return this._progress;},add:function(data){var that=this;if(!data||this.options.disabled){return;}
if(data.fileInput&&!data.files){this._getFileInputFiles(data.fileInput).always(function(files){data.files=files;that._onAdd(null,data);});}else{data.files=$.makeArray(data.files);this._onAdd(null,data);}},send:function(data){if(data&&!this.options.disabled){if(data.fileInput&&!data.files){var that=this,dfd=$.Deferred(),promise=dfd.promise(),jqXHR,aborted;promise.abort=function(){aborted=true;if(jqXHR){return jqXHR.abort();}
dfd.reject(null,'abort','abort');return promise;};this._getFileInputFiles(data.fileInput).always(function(files){if(aborted){return;}
if(!files.length){dfd.reject();return;}
data.files=files;jqXHR=that._onSend(null,data);jqXHR.then(function(result,textStatus,jqXHR){dfd.resolve(result,textStatus,jqXHR);},function(jqXHR,textStatus,errorThrown){dfd.reject(jqXHR,textStatus,errorThrown);});});return this._enhancePromise(promise);}
data.files=$.makeArray(data.files);if(data.files.length){return this._onSend(null,data);}}
return this._getXHRPromise(false,data&&data.context);}});}));(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(jQuery);}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s);}
function decode(s){return config.raw?s:decodeURIComponent(s);}
function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value));}
function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
try{s=decodeURIComponent(s.replace(pluses,' '));return config.json?JSON.parse(s):s;}catch(e){}}
function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value;}
var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setTime(+t+days*864e+5);}
return(document.cookie=[encode(key),'=',stringifyCookieValue(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=read(cookie,value);break;}
if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie;}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false;}
$.cookie(key,'',$.extend({},options,{expires:-1}));return!$.cookie(key);};}));(function($){var counter=0;var modes={iframe:"iframe",popup:"popup"};var standards={strict:"strict",loose:"loose",html5:"html5"};var defaults={mode:modes.iframe,standard:standards.html5,popHt:500,popWd:400,popX:200,popY:200,popTitle:'',popClose:false,extraCss:'',extraHead:'',retainAttr:["id","class","style"]};var settings={};$.fn.printArea=function(options)
{$.extend(settings,defaults,options);counter++;var idPrefix="printArea_";$("[id^="+idPrefix+"]").remove();settings.id=idPrefix+counter;var $printSource=$(this);var PrintAreaWindow=PrintArea.getPrintWindow();PrintArea.write(PrintAreaWindow.doc,$printSource);setTimeout(function(){PrintArea.print(PrintAreaWindow);},1000);};var PrintArea={print:function(PAWindow){var paWindow=PAWindow.win;$(PAWindow.doc).ready(function(){paWindow.focus();paWindow.print();if(settings.mode==modes.popup&&settings.popClose)
setTimeout(function(){paWindow.close();},2000);});},write:function(PADocument,$ele){PADocument.open();PADocument.write(PrintArea.docType()+"<html>"+PrintArea.getHead()+PrintArea.getBody($ele)+"</html>");PADocument.close();},docType:function(){if(settings.mode==modes.iframe)return"";if(settings.standard==standards.html5)return"<!DOCTYPE html>";var transitional=settings.standard==standards.loose?" Transitional":"";var dtd=settings.standard==standards.loose?"loose":"strict";return'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01'+transitional+'//EN" "http://www.w3.org/TR/html4/'+dtd+'.dtd">';},getHead:function(){var extraHead="";var links="";if(settings.extraHead)settings.extraHead.replace(/([^,]+)/g,function(m){extraHead+=m});$(document).find("link").filter(function(){var relAttr=$(this).attr("rel");return($.type(relAttr)==='undefined')==false&&relAttr.toLowerCase()=='stylesheet';}).filter(function(){var mediaAttr=$(this).attr("media");return $.type(mediaAttr)==='undefined'||mediaAttr==""||mediaAttr.toLowerCase()=='print'||mediaAttr.toLowerCase()=='all'}).each(function(){links+='<link type="text/css" rel="stylesheet" href="'+$(this).attr("href")+'" >';});if(settings.extraCss)settings.extraCss.replace(/([^,\s]+)/g,function(m){links+='<link type="text/css" rel="stylesheet" href="'+m+'">'});return"<head><title>"+settings.popTitle+"</title>"+extraHead+links+"</head>";},getBody:function(elements){var htm="";var attrs=settings.retainAttr;elements.each(function(){var ele=PrintArea.getFormData($(this));var attributes=""
for(var x=0;x<attrs.length;x++)
{var eleAttr=$(ele).attr(attrs[x]);if(eleAttr)attributes+=(attributes.length>0?" ":"")+attrs[x]+"='"+eleAttr+"'";}
htm+='<div '+attributes+'>'+$(ele).html()+'</div>';});return"<body>"+htm+"</body>";},getFormData:function(ele){var copy=ele.clone();var copiedInputs=$("input,select,textarea",copy);$("input,select,textarea",ele).each(function(i){var typeInput=$(this).attr("type");if($.type(typeInput)==='undefined')typeInput=$(this).is("select")?"select":$(this).is("textarea")?"textarea":"";var copiedInput=copiedInputs.eq(i);if(typeInput=="radio"||typeInput=="checkbox")copiedInput.attr("checked",$(this).is(":checked"));else if(typeInput=="text")copiedInput.attr("value",$(this).val());else if(typeInput=="select")
$(this).find("option").each(function(i){if($(this).is(":selected"))$("option",copiedInput).eq(i).attr("selected",true);});else if(typeInput=="textarea")copiedInput.text($(this).val());});return copy;},getPrintWindow:function(){switch(settings.mode)
{case modes.iframe:var f=new PrintArea.Iframe();return{win:f.contentWindow||f,doc:f.doc};case modes.popup:var p=new PrintArea.Popup();return{win:p,doc:p.doc};}},Iframe:function(){var frameId=settings.id;var iframeStyle='border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';var iframe;try
{iframe=document.createElement('iframe');document.body.appendChild(iframe);$(iframe).attr({style:iframeStyle,id:frameId,src:"#"+new Date().getTime()});iframe.doc=null;iframe.doc=iframe.contentDocument?iframe.contentDocument:(iframe.contentWindow?iframe.contentWindow.document:iframe.document);}
catch(e){throw e+". iframes may not be supported in this browser.";}
if(iframe.doc==null)throw"Cannot find document.";return iframe;},Popup:function(){var windowAttr="location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";windowAttr+=",width="+settings.popWd+",height="+settings.popHt;windowAttr+=",resizable=yes,screenX="+settings.popX+",screenY="+settings.popY+",personalbar=no,scrollbars=yes";var newWin=window.open("","_blank",windowAttr);newWin.doc=newWin.document;return newWin;}};})(jQuery);+function($){"use strict";var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
this.$window=$(window).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=this.unpin=null
this.checkPosition()}
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var scrollHeight=$(document).height()
var scrollTop=this.$window.scrollTop()
var position=this.$element.offset()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top()
if(typeof offsetBottom=='function')offsetBottom=offset.bottom()
var affix=this.unpin!=null&&(scrollTop+this.unpin<=position.top)?false:offsetBottom!=null&&(position.top+this.$element.height()>=scrollHeight-offsetBottom)?'bottom':offsetTop!=null&&(scrollTop<=offsetTop)?'top':false
if(this.affixed===affix)return
if(this.unpin)this.$element.css('top','')
this.affixed=affix
this.unpin=affix=='bottom'?position.top-scrollTop:null
this.$element.removeClass(Affix.RESET).addClass('affix'+(affix?'-'+affix:''))
if(affix=='bottom'){this.$element.offset({top:document.body.offsetHeight-offsetBottom-this.$element.height()})}}
var old=$.fn.affix
$.fn.affix=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom)data.offset.bottom=data.offsetBottom
if(data.offsetTop)data.offset.top=data.offsetTop
$spy.affix(data)})})}(jQuery);+function($){"use strict";var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.hasClass('alert')?$this:$this.parent()}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one($.support.transition.end,removeElement).emulateTransitionEnd(150):removeElement()}
var old=$.fn.alert
$.fn.alert=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){"use strict";var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)}
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state=state+'Text'
if(!data.resetText)$el.data('resetText',$el[val]())
$el[val](data[state]||this.options[state])
setTimeout(function(){state=='loadingText'?$el.addClass(d).attr(d,d):$el.removeClass(d).removeAttr(d);},0)}
Button.prototype.toggle=function(){var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input').prop('checked',!this.$element.hasClass('active')).trigger('change')
if($input.prop('type')==='radio')$parent.find('.active').removeClass('active')}
this.$element.toggleClass('active')}
var old=$.fn.button
$.fn.button=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^=button]',function(e){var $btn=$(e.target)
if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn')
$btn.button('toggle')
e.preventDefault()})}(jQuery);+function($){"use strict";var Carousel=function(element,options){this.$element=$(element)
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=this.sliding=this.interval=this.$active=this.$items=null
this.options.pause=='hover'&&this.$element.on('mouseenter',$.proxy(this.pause,this)).on('mouseleave',$.proxy(this.cycle,this))}
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getActiveIndex=function(){this.$active=this.$element.find('.item.active')
this.$items=this.$active.parent().children()
return this.$items.index(this.$active)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getActiveIndex()
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',$(this.$items[pos]))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition.end){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||$active[type]()
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var fallback=type=='next'?'first':'last'
var that=this
if(!$next.length){if(!this.options.wrap)return
$next=this.$element.find('.item')[fallback]()}
this.sliding=true
isCycling&&this.pause()
var e=$.Event('slide.bs.carousel',{relatedTarget:$next[0],direction:direction})
if($next.hasClass('active'))return
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
this.$element.one('slid',function(){var $nextIndicator=$(that.$indicators.children()[that.getActiveIndex()])
$nextIndicator&&$nextIndicator.addClass('active')})}
if($.support.transition&&this.$element.hasClass('slide')){this.$element.trigger(e)
if(e.isDefaultPrevented())return
$next.addClass(type)
$next[0].offsetWidth
$active.addClass(direction)
$next.addClass(direction)
$active.one($.support.transition.end,function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger('slid')},0)}).emulateTransitionEnd(600)}else{this.$element.trigger(e)
if(e.isDefaultPrevented())return
$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger('slid')}
isCycling&&this.cycle()
return this}
var old=$.fn.carousel
$.fn.carousel=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
$(document).on('click.bs.carousel.data-api','[data-slide], [data-slide-to]',function(e){var $this=$(this),href
var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
$target.carousel(options)
if(slideIndex=$this.attr('data-slide-to')){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()})
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
$carousel.carousel($carousel.data())})})}(jQuery);+function($){"use strict";var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.transitioning=null
if(this.options.parent)this.$parent=$(this.options.parent)
if(this.options.toggle)this.toggle()}
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var actives=this.$parent&&this.$parent.find('> .panel > .in')
if(actives&&actives.length){var hasData=actives.data('bs.collapse')
if(hasData&&hasData.transitioning)return
actives.collapse('hide')
hasData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')
[dimension](0)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('in')
[dimension]('auto')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)
[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element
[dimension](this.$element[dimension]())
[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
var old=$.fn.collapse
$.fn.collapse=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle=collapse]',function(e){var $this=$(this),href
var target=$this.attr('data-target')||e.preventDefault()||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
var $target=$(target)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
var parent=$this.attr('data-parent')
var $parent=parent&&$(parent)
if(!data||!data.transitioning){if($parent)$parent.find('[data-toggle=collapse][data-parent="'+parent+'"]').not($this).addClass('collapsed')
$this[$target.hasClass('in')?'addClass':'removeClass']('collapsed')}
$target.collapse(option)})}(jQuery);+function($){"use strict";var backdrop='.dropdown-backdrop'
var toggle='[data-toggle=dropdown]'
var Dropdown=function(element){var $el=$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click',clearMenus)}
$parent.trigger(e=$.Event('show.bs.dropdown'))
if(e.isDefaultPrevented())return
$parent.toggleClass('open').trigger('shown.bs.dropdown')
$this.focus()}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27)/.test(e.keyCode))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive||(isActive&&e.keyCode==27)){if(e.which==27)$parent.find(toggle).focus()
return $this.click()}
var $items=$('[role=menu] li:not(.divider):visible a',$parent)
if(!$items.length)return
var index=$items.index($items.filter(':focus'))
if(e.keyCode==38&&index>0)index--
if(e.keyCode==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).focus()}
function clearMenus(){$(backdrop).remove()
$(toggle).each(function(e){var $parent=getParent($(this))
if(!$parent.hasClass('open'))return
$parent.trigger(e=$.Event('hide.bs.dropdown'))
if(e.isDefaultPrevented())return
$parent.removeClass('open').trigger('hidden.bs.dropdown')})}
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
var old=$.fn.dropdown
$.fn.dropdown=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('dropdown')
if(!data)$this.data('dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle+', [role=menu]',Dropdown.prototype.keydown)}(jQuery);+function($){"use strict";var Modal=function(element,options){this.options=options
this.$element=$(element)
this.$backdrop=this.isShown=null
if(this.options.remote)this.$element.load(this.options.remote)}
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this[!this.isShown?'show':'hide'](_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.escape()
this.$element.on('click.dismiss.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(document.body)}
that.$element.show()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$element.find('.modal-dialog').one($.support.transition.end,function(){that.$element.focus().trigger(e)}).emulateTransitionEnd(300):that.$element.focus().trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one($.support.transition.end,$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.focus()}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keyup.dismiss.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.removeBackdrop()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(document.body)
this.$element.on('click.dismiss.modal',$.proxy(function(e){if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}else if(callback){callback()}}
var old=$.fn.modal
$.fn.modal=function(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
e.preventDefault()
$target.modal(option,this).one('hide',function(){$this.is(':visible')&&$this.focus()})})
$(document).on('show.bs.modal','.modal',function(){$(document.body).addClass('modal-open')}).on('hidden.bs.modal','.modal',function(){$(document.body).removeClass('modal-open')})}(jQuery);+function($){"use strict";var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
this.init('tooltip',element,options)}
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focus'
var eventOut=trigger=='hover'?'mouseleave':'blur'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
if(e.isDefaultPrevented())return
var $tip=this.tip()
this.setContent()
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var $parent=this.$element.parent()
var orgPlacement=placement
var docScroll=document.documentElement.scrollTop||document.body.scrollTop
var parentWidth=this.options.container=='body'?window.innerWidth:$parent.outerWidth()
var parentHeight=this.options.container=='body'?window.innerHeight:$parent.outerHeight()
var parentLeft=this.options.container=='body'?0:$parent.offset().left
placement=placement=='bottom'&&pos.top+pos.height+actualHeight-docScroll>parentHeight?'top':placement=='top'&&pos.top-docScroll-actualHeight<0?'bottom':placement=='right'&&pos.right+actualWidth>parentWidth?'left':placement=='left'&&pos.left-actualWidth<parentLeft?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
this.$element.trigger('shown.bs.'+this.type)}}
Tooltip.prototype.applyPlacement=function(offset,placement){var replace
var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$tip.offset(offset).addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){replace=true
offset.top=offset.top+height-actualHeight}
if(/bottom|top/.test(placement)){var delta=0
if(offset.left<0){delta=offset.left*-2
offset.left=0
$tip.offset(offset)
actualWidth=$tip[0].offsetWidth
actualHeight=$tip[0].offsetHeight}
this.replaceArrow(delta-width+actualWidth,actualWidth,'left')}else{this.replaceArrow(actualHeight-height,actualHeight,'top')}
if(replace)$tip.offset(offset)}
Tooltip.prototype.replaceArrow=function(delta,dimension,position){this.arrow().css(position,delta?(50*(1-delta/dimension)+"%"):'')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(){var that=this
var $tip=this.tip()
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&this.$tip.hasClass('fade')?$tip.one($.support.transition.end,complete).emulateTransitionEnd(150):complete()
this.$element.trigger('hidden.bs.'+this.type)
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function(){var el=this.$element[0]
return $.extend({},(typeof el.getBoundingClientRect=='function')?el.getBoundingClientRect():{width:el.offsetWidth,height:el.offsetHeight},this.$element.offset())}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.tip=function(){return this.$tip=this.$tip||$(this.options.template)}
Tooltip.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow')}
Tooltip.prototype.validate=function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=e?$(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type):this
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){this.hide().$element.off('.'+this.type).removeData('bs.'+this.type)}
var old=$.fn.tooltip
$.fn.tooltip=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){"use strict";var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content')[this.options.html?'html':'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.arrow')}
Popover.prototype.tip=function(){if(!this.$tip)this.$tip=$(this.options.template)
return this.$tip}
var old=$.fn.popover
$.fn.popover=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){"use strict";function ScrollSpy(element,options){var href
var process=$.proxy(this.process,this)
this.$element=$(element).is('body')?$(window):$(element)
this.$body=$('body')
this.$scrollElement=this.$element.on('scroll.bs.scroll-spy.data-api',process)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||((href=$(element).attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))||'')+' .nav li > a'
this.offsets=$([])
this.targets=$([])
this.activeTarget=null
this.refresh()
this.process()}
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.refresh=function(){var offsetMethod=this.$element[0]==window?'offset':'position'
this.offsets=$([])
this.targets=$([])
var self=this
var $targets=this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#\w/.test(href)&&$(href)
return($href&&$href.length&&[[$href[offsetMethod]().top+(!$.isWindow(self.$scrollElement.get(0))&&self.$scrollElement.scrollTop()),href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){self.offsets.push(this[0])
self.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight
var maxScroll=scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(scrollTop>=maxScroll){return activeTarget!=(i=targets.last()[0])&&this.activate(i)}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(!offsets[i+1]||scrollTop<=offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
$(this.selector).parents('.active').removeClass('active')
var selector=this.selector
+'[data-target="'+target+'"],'
+this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate')}
var old=$.fn.scrollspy
$.fn.scrollspy=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
$spy.scrollspy($spy.data())})})}(jQuery);+function($){"use strict";var Tab=function(element){this.element=$(element)}
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var previous=$ul.find('.active:last a')[0]
var e=$.Event('show.bs.tab',{relatedTarget:previous})
$this.trigger(e)
if(e.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.parent('li'),$ul)
this.activate($target,$target.parent(),function(){$this.trigger({type:'shown.bs.tab',relatedTarget:previous})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&$active.hasClass('fade')
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
element.addClass('active')
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu')){element.closest('li.dropdown').addClass('active')}
callback&&callback()}
transition?$active.one($.support.transition.end,next).emulateTransitionEnd(150):next()
$active.removeClass('in')}
var old=$.fn.tab
$.fn.tab=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault()
$(this).tab('show')})}(jQuery);+function($){"use strict";function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={'WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'oTransitionEnd otransitionend','transition':'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}}
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(jQuery);$(function(){function attach(base){$(base).find('.pln-confirm').not('.hasConfirm').addClass('hasConfirm').on('click',function(event){var message=$(this).data('confirm');if(!confirm(message)){event.preventDefault();event.stopImmediatePropagation();}});};$(document).on('pln-dom-changed',function(event){attach(event.target);});attach(document);});$(function(){function handler(event){event.preventDefault();var type=$(this).attr('method')||'get';var url=$(this).attr('action')||$(this).attr('href');var data=$(this).serialize();var dataType=$(this).data('type')||'json';var that=this;$.ajax({type:type,url:url,data:data,dataType:dataType}).done(function(data){$(that).trigger('pln-ajax-done',[data]);}).fail(function(){$(that).trigger('pln-ajax-fail');});$(this).find('.pln-ajax-button-workaround').remove();}
$(document).on('submit','form.pln-ajax',handler);$(document).on('click',':not(form).pln-ajax',handler);function button_workaround(event){var form=$(this).parents('form.pln-ajax');var hidden=form.find('.pln-ajax-button-workaround');if(hidden.length==0){hidden=$('<input class="pln-ajax-button-workaround" type="hidden">').appendTo(form);}
hidden.attr('name',$(this).attr('name'));hidden.attr('value',$(this).attr('value'));}
$(document).on('click','form.pln-ajax button[type="submit"]',button_workaround)
$(document).on('click','form.pln-ajax input[type="submit"]',button_workaround)});$(function(){function done(event,data){var target=$(this).data('target');$(target).html(data).trigger('pln-dom-changed').modal('show');$(this).removeClass('pln-ajax pln-ajax-modal-once');$(this).attr('data-toggle','modal');}
function fail(event){var target=$(this).data('fail-target');$(target).subModal();}
$(document).on('pln-ajax-done','.pln-ajax-modal-once',done);$(document).on('pln-ajax-fail','.pln-ajax-modal-once',fail);});$(function(){function execute(ops){if(!ops.length)return;var op=ops[0];var next=function(){execute(ops.slice(1));};switch(op.operation){case'content':$(op.target||this).html(op.content).trigger('pln-dom-changed');next();break;case'redirect':window.location=op.location;next();break;case'close-modal':$.hideBootstrapModal(next);break;}}
function done(event,data){if(data.result!='operations')return;execute(data.operations);}
function fail(event){var target=$(this).data('fail-target');$(target).subModal();}
$(document).on('pln-ajax-done','.pln-ajax-operations',done);$(document).on('pln-ajax-fail','.pln-ajax-operations',fail);});$(function(){$(document).on('focus','.pln-autocomplete',function(event){if(!$(this).hasClass('ui-autocomplete-input')){var source=$(this).data('autocomplete-url');$(this).autocomplete({source:source,minLength:2});}else{$(this).autocomplete("search");}});});$(function(){function autosize(){$(this).css({'height':'auto','overflow-y':'hidden',});var lineHeight=parseFloat($(this).css('line-height'));var paddingHeight=$(this).innerHeight()-$(this).height();var contentHeight=this.scrollHeight-paddingHeight;var computedLines=Math.max(3,Math.ceil(contentHeight/lineHeight));var computedHeight=computedLines*lineHeight;$(this).height(computedHeight);};function autosizeAll(){$('textarea.pln-autosize').each(autosize);};$(document).on('input','textarea.pln-autosize',autosize);$(document).on('pln-dom-changed',autosizeAll);$(window).on('resize',autosizeAll);autosizeAll();});$(function(){$(document).on('focusin','.pln-composite-text',function(){$(this).addClass('pln-composite-text-focus');})
$(document).on('focusout','.pln-composite-text',function(){$(this).removeClass('pln-composite-text-focus');})});$(function(){$(document).on('focus','.pln-datepicker',function(event){if(!$(this).hasClass('hasDatepicker')){var lang=$('html').attr('lang');$(this).datepicker($.datepicker.regional[lang=='en'?'':lang]);$(this).datepicker('show');}});});$(function(){function repeat(s,n){var r='';while(n>0){if(n&1)r+=s;n>>=1;s+=s;}
return r;}
function getContent(element){var e=$('<pre/>').html(element.html());e.find('div, p').replaceWith(function(){return this.innerHTML+'\n';});e.find('br').replaceWith('\n');var t=e.text();if(t&&t[t.length-1]==='\n')t=t.slice(0,-1);t=t.replace(/\n[^\S\n]*/g,'\n        ');return t;}
function update(element){var content=getContent(element);var padding=content.match(/\n\s*$/)?0:content.length<10?47:5
element.attr('data-padding',repeat('. ',padding));element.next().val(content);element.html(content);}
function updateAll(){$('.pln-editable-span').each(function(){update($(this));});}
$(document).on('blur','.pln-editable-span',function(){update($(this));});$(document).on('focusin','.pln-editable-container',function(){$(this).addClass('focus');});$(document).on('focusout','.pln-editable-container',function(){$(this).removeClass('focus');});$(document).on('pln-dom-changed',function(){updateAll();});updateAll();});$(function(){$.hideBootstrapModal=function(then){if($('.modal.in').length){$('body').on('hidden.bs.modal','.modal',function(){$('body').off('.bs.modal');then();});$('.modal.in').modal('hide');}else{then();}};});$(function(){function inform(){window.alert('Na vývoji tejto časti portálu ešte pracujeme. Ďakujeme za trpezlivosť.');};$(document).on('click','a.pln-not-implemented',function(event){event.preventDefault();inform();});$(document).on('submit','form.pln-not-implemented',function(event){event.preventDefault();inform();});});$(function(){$(document).on('click','a.pln-post',function(event){event.preventDefault();var form=$('<form action="" method="post" style="display: none;"></form>');form.attr('action',$(this).attr('href'));$.each(this.attributes,function(){if(this.name.substring(0,10)=="data-post-"){var input=$('<input type="hidden" name="" value="">');input.attr('name',this.name.substring(10));input.attr('value',this.value);input.appendTo(form);}});form.appendTo('body');form.submit();});});$(function(){$(document).on('click','.pln-print',function(event){event.preventDefault();var target=$(this).data('target');$(target).printArea();});});$(function(){$('.pln-range-widget').each(function(){var slider=$(this).children('input').eq(0);var output=$(this).children('span').eq(0);output.html($(slider).val());slider.attr('value',$(slider).val());$(document).on('input','.pln-range-widget',function(event){var slider=$(this).children('input').eq(0);var output=$(this).children('span').eq(0);output.html($(slider).val());slider.attr('value',event.target.value);});});});$(function(){$.fn.subModal=function(){var layers=$('.modal-backdrop');this.modal('show');this.css('z-index',parseInt(this.css('z-index'))+30*layers.length);var backdrop=$('.modal-backdrop').not(layers);backdrop.css('z-index',parseInt(backdrop.css('z-index'))+30*layers.length);};});$(function(){$(document).on('click','.pln-reload',function(event){event.preventDefault();location.reload();});});$(function(){$.fn.scrollTo=function(){if(this.length){var skip=parseInt($('body').css('padding-top'));var top=this.offset().top-skip;$('html, body').animate({scrollTop:top},200);}};});$(function(){function toggle(){var container=$(this).data('container')||'html';var value=$(this).is(':checkbox')?$(this).prop('checked'):$(this).val();var active=$(this).attr('data-hide-target-'+value);var all=$.map(this.attributes,function(attr){if(attr.name.match("^data-hide-target-"))return attr.value;}).join(', ');$(this).closest(container).find(all).not(active).hide();$(this).closest(container).find(active).show();var active=$(this).attr('data-disable-target-'+value);var all=$.map(this.attributes,function(attr){if(attr.name.match("^data-disable-target-"))return attr.value;}).join(', ');$(this).closest(container).find(all).not(active).prop('disabled',true);$(this).closest(container).find(active).prop('disabled',false);}
function toggleAll(){var checked={};var unchecked={};$('.pln-toggle-changed:radio').each(function(){if($(this).prop('checked')){checked[this.name]=this;delete unchecked[this.name];}else if(!checked[this.name]){unchecked[this.name]=this;}});$.each(checked,toggle);$.each(unchecked,toggle);$('.pln-toggle-changed:not(:radio)').each(toggle);}
$(document).on('change','.pln-toggle-changed',toggle);$(document).on('pln-dom-changed',toggleAll);toggleAll();});$(function(){function tooltip(base){$(base).find('.pln-with-tooltip').not('.hasTooltip').addClass('hasTooltip').each(function(){if($(this).hasClass('pln-tooltip-permanent')){$(this).tooltip({trigger:'manual'}).tooltip('show');}else{$(this).tooltip();}});};$(document).on('pln-dom-changed',function(event){tooltip(event.target);});tooltip(document);});$(function(){function fileupload(base){var inputs=$(base).find('.pln-attachments input[type=file]');inputs.not('.hasFileupload').addClass('hasFileupload').each(function(){$(this).fileupload({dataType:'json',singleFileUploads:false,limitMultiFileUploadSize:15*1000*1000,formData:{'csrfmiddlewaretoken':$.cookie('csrftoken')},});});};function disable(container,disabled){var button=container.find('.pln-attachments-btn');var widget=button.find('input[type=file]');button.toggleClass('disabled',disabled);widget.prop('disabled',disabled);};function progress(container,percent,toggle){var progress=container.find('.pln-attachments-progress');var progressbar=progress.find('.progress-bar');progressbar.css({width:percent+'%'});progressbar.text(percent+'%');if(toggle=='show')progress.show();if(toggle=='hide')progress.hide();if(toggle=='in')progress.slideDown(300);if(toggle=='out')progress.slideUp(300);};function error(container,toggle){var alert=container.find('.pln-attachments-error .alert');if(toggle=='show')alert.show();if(toggle=='hide')alert.hide();};$(document).on('fileuploadstart','.pln-attachments',function(event,data){var container=$(this);error(container,'hide');disable(container,true);progress(container,0,'in');});$(document).on('fileuploadprogressall','.pln-attachments',function(event,data){var container=$(this);var percent=(data.loaded/data.total*100).toFixed();progress(container,percent)});$(document).on('fileuploaddone','.pln-attachments',function(event,data){var container=$(this);var field=$(container.data('field'));var skel=container.find('.pln-attachments-skel');var list=container.find('.pln-attachments-list');data.result.files.forEach(function(file){var attachment=$(skel.html());attachment.data('attachment',file.pk);attachment.find('a').attr('href',file.url).html(file.name);list.append(attachment).append(' ');field.val(field.val()+','+file.pk+',');});});$(document).on('fileuploadfail','.pln-attachments',function(event,data){var container=$(this);progress(container,0,'hide');error(container,'show');});$(document).on('fileuploadstop','.pln-attachments',function(event,data){var container=$(this);disable(container,false);progress(container,100,'out');});$(document).on('click','.pln-attachment-del',function(event){var container=$(this).closest('.pln-attachments');var field=$(container.data('field'));var attachment=$(this).closest('.pln-attachment');var pk=attachment.data('attachment');attachment.hide(300,function(){attachment.remove();});field.val(field.val().replace(','+pk+',',','));});$(document).on('pln-dom-changed',function(event){fileupload(event.target);});fileupload(document);});$(function(){function handler(event,ui){if(ui.item){var obligee=ui.item.obligee;$('.chv-obligee-widget-street',this).text(obligee.street);$('.chv-obligee-widget-zip',this).text(obligee.zip);$('.chv-obligee-widget-city',this).text(obligee.city);$('.chv-obligee-widget-email',this).text(obligee.emails);$('.chv-obligee-widget-details',this).show();}else{$('.chv-obligee-widget-details',this).hide();}}
$(document).on('autocompleteselect','.chv-obligee-widget-input',handler);$(document).on('autocompletechange','.chv-obligee-widget-input',handler);});$(function(){function add(container){var inputs=container.find('.chv-obligee-widget-inputs');var skel=container.find('.chv-obligee-widget-skel');var clone=skel.children().clone();var input=clone.find('input');input.attr('name',input.data('name'));clone.appendTo(inputs);}
function del(input){var container=input.closest('.chv-obligee-widget');var inputs=input.closest('.chv-obligee-widget-inputs');input.remove();if(inputs.find('.chv-obligee-widget-input').length==0){add(container);}}
function handle_add(event){event.preventDefault();add($(this).closest('.chv-obligee-widget'));}
function handle_del(event){event.preventDefault();del($(this).closest('.chv-obligee-widget-input'));}
$(document).on('click','.chv-obligee-widget-add',handle_add);$(document).on('click','.chv-obligee-widget-del',handle_del);});$(function(){$('body').on('click','.chv-dropdown-panel',function(event){event.stopPropagation();});$('body').on('click','[data-hide]',function(event){$(this).closest('.'+$(this).attr('data-hide')).hide();});});