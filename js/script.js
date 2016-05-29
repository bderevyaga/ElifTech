'use strict'
var urlSerevar = "http://donet.hol.es/serever.php";

var tree = document.getElementById('tree');
var data;
var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
var xhr = new XHR();
xhr.open("GET", urlSerevar, true);
xhr.onload = function() {
  data = JSON.parse(this.responseText);
  tree.appendChild(allPointSum(0).ul);
}
xhr.send();

function allPointSum(id) {
	var ul = document.createElement('ul');
	var allPoint = 0;
	for (var index in data) {
		if (data[index].parent == id) {
			var buf = allPointSum(data[index].id);
			ul.appendChild(createElementTree(data[index], buf.allPoint)).appendChild(buf.ul);
			allPoint += parseInt(data[index].point);
			allPoint += buf.allPoint;
		}
	}
	ul.appendChild(createElementAddTree(id));
	return {
		allPoint: allPoint,
		ul: ul
	}
}

function createElementTree(element, allPoint) {
	var span = [];
	var neme = element.name + ' | ' + element.point + '$' + (allPoint > 0 ? ' | ' + (parseInt(element.point) + allPoint) + '$' : '');
	span.push(createSpan([], hiddeElementTree, neme));
	span.push(createSpan(['label', 'label-primary'], function () { edit(element.id) }, 'edit'));
	span.push(createSpan(['label', 'label-danger'], function () { del(element.id) }, 'del'));
	var li = document.createElement('li');
	for (var index in span)
		li.appendChild(span[index]);
	return li;
}

function createElementAddTree(id) {
	var span = [];
	span.push(createSpan(['label', 'label-default'], function () { add(id) }, 'add'));
	var li = document.createElement('li');
	for (var index in span)
		li.appendChild(span[index]);
	return li;
}

function createSpan(cl, fn, name) {
	var span = document.createElement('span');
	for (var index in cl)
		span.classList.add(cl[index]);
	span.addEventListener("click", fn);
	span.textContent = name;
	return span;
}

function hiddeElementTree(event) {
	var target = event.target;
	var li = target.parentNode;
	var childrenContainer = li.getElementsByTagName('ul')[0];
	if (!childrenContainer) return;
	childrenContainer.hidden = !childrenContainer.hidden;
}

function del(id) {
	for (var index in data) {
		if (data[index].id === id) {
			delete data[index];
		}
	}
	AjaxTree('DELETE', urlSerevar, {
		id: id
	})
	reloadTree();
}

function edit(id) {
	$('#modal').modal('show');
	var modalSubmit = document.getElementById('modalSave');
	var gridSystemModalLabel = document.getElementById('gridSystemModalLabel');
	gridSystemModalLabel.innerHTML = 'Edit Element';
	var name = document.getElementById('name');
	var point = document.getElementById('point');
	for (var index in data) {
		if (data[index].id === id) {
			name.value = data[index].name;
			point.value = data[index].point;
			modalSubmit.addEventListener('click', function () { editData(id) }, false);
		}
	}
}

function add(id) {
	$('#modal').modal('show');
	document.getElementById("form").reset();
	var modalSubmit = document.getElementById('modalSave');
	var gridSystemModalLabel = document.getElementById('gridSystemModalLabel');
	gridSystemModalLabel.innerHTML = 'Add Element';
	modalSubmit.addEventListener('click', function () { addData(id) }, false);
}


function addData(id) {
	var modalSubmit = document.getElementById('modalSave');
	modalSubmit.parentNode.innerHTML = modalSubmit.parentNode.innerHTML;
	var name = document.getElementById('name');
	var point = document.getElementById('point');
	AjaxTree('POST', urlSerevar, {
		name: name.value,
		point: parseInt(point.value),
		parent: id
	}, function(param){
		data = JSON.parse(param.responseText);
  		tree.innerHTML = '';
		tree.appendChild(allPointSum(0).ul);
	});
	$('#modal').modal('hide');
}

function editData(id) {
	for (var index in data) {
		if (data[index].id === id) {
			var modalSubmit = document.getElementById('modalSave');
			modalSubmit.parentNode.innerHTML = modalSubmit.parentNode.innerHTML;
			var name = document.getElementById('name');
			var point = document.getElementById('point');
			data[index].name = name.value;
			data[index].point = parseInt(point.value);
			AjaxTree('PUT', urlSerevar, {
				id: id,
				name: name.value,
				point: parseInt(point.value)
			});
			reloadTree();
		}
	}
	$('#modal').modal('hide');
}

function AjaxTree(type, url, data, cb){
	cb = cb? cb: function(sd){};
	var form = new FormData();
	for (var index in data)
		form.append(index, data[index]);
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	var xhr = new XHR();
	xhr.open(type, url, true);
	xhr.send(form);
	xhr.onload = function() {
		cb(this);
	}
}

function reloadTree(){
	tree.innerHTML = '';
	tree.appendChild(allPointSum(0).ul);
}