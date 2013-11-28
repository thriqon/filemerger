/* global ko */



var viewModel = {};
viewModel.files = ko.observableArray();


viewModel.download = function() {
    var unloadedFiles = [];
    var loadedFileContents = {};
    viewModel.files().forEach(function (f) {
       unloadedFiles.push(f);
       
    });
    
    var fr = new FileReader();
    var currentFilePath = unloadedFiles.pop();
    if (!currentFilePath)
        return;
    fr.onload = function () {
            loadedFileContents[currentFilePath.path()] = fr.result;
            currentFilePath = unloadedFiles.pop();
            if(currentFilePath) {
                fr.readAsText(currentFilePath.File);
            } else {
                viewModel.mergeFiles(loadedFileContents);
            }
    };
    fr.readAsText(currentFilePath.File);
};

viewModel.mergeFiles = function (contents) {
    var regex = new RegExp(viewModel.pattern(), "g");
    var finishedFiles = {};
    var getFullyMergedFile = function (path) {
        if (finishedFiles[path])
            return finishedFiles[path];
        finishedFiles[path] = contents[path].replace(regex, function (match, p1, p2) {
            console.log("Loading" + p2);
           return getFullyMergedFile(p2 + '.tex');
        });
        return finishedFiles[path];
    };
    
    alert(getFullyMergedFile("main.tex"));
};

viewModel.pattern = ko.observable("\\\\(include|input)\\{(.*)\\}");


var FileViewModel = function() {
    var self = this;

    self.path = ko.observable("");
    self.size = ko.observable("");
    self.lastModified = ko.observable("");

    self.File = null;

    self.removeFile = function() {
        viewModel.files.remove(self);
    };
}

$(document).ready(function() {
    var dropzone = $('#dropzone');
    dropzone.on('dragenter', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.effectAllowed = 'link';
        dropzone.className = "over";
    }).on("dragover", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.dropEffect = 'link';
    }).on("dragleave", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        dropzone.className = "";
    }).on("drop", function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        dropzone.className = "";

        var files = evt.originalEvent.dataTransfer.files;
        for (var i = 0, f;
        (f = files[i]); i++) {
            var fm = new FileViewModel();
            fm.path(f.name);
            fm.size(f.size);
            fm.lastModified(f.lastModified);
            fm.File = f;
            if (viewModel.files().every(function(x) {
                return x.path() != fm.path();
            })) {
                viewModel.files.push(fm);
            }   

        }
        return false;
    });

    ko.applyBindings(viewModel);
});
