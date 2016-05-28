'use strict'
var data = [
	{
		id: 1,
		name: 'test1',
		point: 2,
		parent: 0
	},
	{
		id: 2,
		name: 'test2',
		point: 1,
		parent: 0
	},
	{
		id: 3,
		name: 'test3',
		point: 1,
		parent: 1
	},
	{
		id: 4,
		name: 'test4',
		point: 1,
		parent: 1
	},
	{
		id: 5,
		name: 'test5',
		point: 2,
		parent: 2
	},
	{
		id: 6,
		name: 'test6',
		point: 2,
		parent: 3
	},
	{
		id: 7,
		name: 'test7',
		point: 2,
		parent: 3
	},
	{
		id: 8,
		name: 'test8',
		point: 2,
		parent: 1
	},
	{
		id: 9,
		name: 'test9',
		point: 2,
		parent: 5
	}
];

var tree = document.getElementById('tree');
tree.appendChild(allPointSum(0).ul);

function allPointSum(id) {
	var ul = document.createElement('ul');
	var allPoint = 0;
	for (var index in data) {
		if (data[index].parent === id) {
			var buf = allPointSum(data[index].id);
			ul.appendChild(createElementTree(data[index], buf.allPoint)).appendChild(buf.ul);
			allPoint += data[index].point;
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
	var neme = element.name + ' | ' + element.point + '$' + (allPoint > 0 ? ' | ' + (element.point + allPoint) + '$' : '');
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
	tree.innerHTML = '';
	tree.appendChild(allPointSum(0).ul);
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
	data.push({
		id: data.length + 1,
		name: name.value,
		point: parseInt(point.value),
		parent: id
	})
	tree.innerHTML = '';
	tree.appendChild(allPointSum(0).ul);
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
			tree.innerHTML = '';
			tree.appendChild(allPointSum(0).ul);
		}
	}
	$('#modal').modal('hide');
}