// Base in a example of Matthew Brennan Jones that shows the uncopress.js lib
// https://github.com/workhorsy/uncompress.js

function isValidImageType(file_name) {
	file_name = file_name.toLowerCase();
	return file_name.endsWith('.jpeg') ||
			file_name.endsWith('.jpg') ||
			file_name.endsWith('.png') ||
			file_name.endsWith('.bmp') ||
			file_name.endsWith('.webp') ||
			file_name.endsWith('.gif');
}

function getFileMimeType(file_name) {
	file_name = file_name.toLowerCase();
	if (file_name.endsWith('.jpeg') || file_name.endsWith('.jpg')) {
		return 'image/jpeg';
	} else if (file_name.endsWith('.png')) {
		return 'image/png';
	} else if (file_name.endsWith('.bmp')) {
		return 'image/bmp';
	} else if (file_name.endsWith('.webp')) {
		return 'image/webp';
	} else if (file_name.endsWith('.gif')) {
		return 'image/gif';
	} else {
		// Uses jpeg as default mime type
		return 'image/jpeg';
	}
}

function mangaPicture(){

	this.indice = 0;
	this.mangaLenght = false;
	this.entries = [];
	this.container = false;
	this.initPic = false;

	this.setContainer = function(container){
		this.container = container;
		this.container.src = '';
	};

	this.setLength = function(mangaLenght){
		this.mangaLenght = mangaLenght;
	};

	this.setEntries = function(entries){
		this.entries = entries;
	};

	this.incrementInd = function(){
		if(this.indice < this.mangaLenght - 1){
			if(!this.initPic){
				entry = this.entries[0];
				this.initPic = true;
			}
			else{
				entry = this.entries[++this.indice]	
			}
			mangaObj = this;
			entry.readData(function(data, err) {
				var blob = new Blob([data], {type: getFileMimeType(entry.name)});
				var url = URL.createObjectURL(blob);
				mangaObj.container.src = url;
			});
			parent = this.container.parentNode;
			parent.scrollTop = 0;
			return this.container.src;
		} 
	};

	this.decrementInd = function(){
		if(this.indice > 0){
			entry = this.entries[--this.indice]
			mangaObj = this;
			entry.readData(function(data, err) {
				var blob = new Blob([data], {type: getFileMimeType(entry.name)});
				var url = URL.createObjectURL(blob);
				mangaObj.container.src = url;
			});
			parent = this.container.parentNode;
			parent.scrollTop = 0;
			return this.container.src;
		}
	};
}

function createLinkForEachEntry(archive) {

	var entries = [];
	archive.entries.forEach(function(entry) {
		if (isValidImageType(entry.name)) {
			entries.push(entry);
		}
	});

	archive.entries = entries;

	var spanIncrement = document.getElementById('nextScene');
	var spanDecrement = document.getElementById('previousScene');
	var container = document.getElementById('imgView');

	var pictureManga = new mangaPicture();
	
	pictureManga.setEntries(entries);
	pictureManga.setContainer(container);

	spanIncrement.addEventListener('click', function(e) {
		pictureManga.incrementInd();
	});

	spanDecrement.addEventListener('click', function(e) {
		pictureManga.decrementInd();
	});

	pictureManga.setLength(entries.length);

	container.src = pictureManga.incrementInd();

}

window.onload = function() {

	loadArchiveFormats(['rar', 'zip', 'tar']);

	var lateralBarUpload = document.getElementById('asideBar').children[2];
	var buttonBoxUpload = document.getElementById('showViewManga');
	var buttonFullScreen = document.getElementById('fullscreen');

	lateralBarUpload.addEventListener('click', function(e) {
		$('#loadFile').toggleClass('container_focus'); 
	});
	buttonBoxUpload.addEventListener('click', function(e) {
		$('#loadFile').toggleClass('container_focus'); 
	});
	buttonFullScreen.addEventListener('click', function(e) {
		$('#manga_container').toggleClass('fullscreen');
	});

	document.getElementById('mangaInput').onchange = function() {
		// Just return if there is no file selected
		var file_input = document.getElementById('mangaInput');
		window.location.hash = '';
		document.getElementById('imgView').src = '';

		var file = file_input.files[0];

		archiveOpenFile(file, function(archive, err) {
			if (archive) {
				document.getElementById('imgView').src = '';
				createLinkForEachEntry(archive);
			}
		});
		
		$('#loadFile').toggleClass('container_focus'); 
	};
};
