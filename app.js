/* global ko */

var viewModel = {
    files : ko.observableArray(),
    
    download : function () {
        var filesHash = {};
        
        self.files().each(function (fwm) {
            
        });
    }
};

var FileViewModel = function () {
    var self = this;
    
    self.path = ko.observable("");
    self.size = ko.observable("");
    self.lastModified = ko.observable("");
    
    self.File = null;
    
    self.removeFile = function () {
        viewModel.files.remove(self);
    };
}

$(document).ready(function () {
    var dropzone = $('#dropzone');
    dropzone.on('dragenter', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.effectAllowed = 'link';
        dropzone.className = "over";
    }).on("dragover", function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.dropEffect = 'link';
    }).on("dragleave", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        dropzone.className = "";
    }).on("drop", function(evt) {
        evt.preventDefault(); evt.stopPropagation();
        dropzone.className = "";
        
        var files = evt.originalEvent.dataTransfer.files;
        for (var i = 0, f ; (f = files[i]); i++) {
            var fm = new FileViewModel();
            fm.path(f.name);
            fm.size(f.size);
            fm.lastModified(f.lastModified);
            fm.File = f;
            viewModel.files.push(fm);
        }
        return false;
    });

    ko.applyBindings(viewModel);
});
