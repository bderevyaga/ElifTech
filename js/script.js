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
		point: 2,
		parent: 0
	},
	{
		id: 3,
		name: 'test3',
		point: 2,
		parent: 1
	},
	{
		id: 4,
		name: 'test4',
		point: 2,
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

addTree();

function addTree(){
	tree.innerHTML = '';
	var ul = document.createElement('div');
	var li = document.createElement('li');
	tree.appendChild(ul).id = 'treeId_0';

	addСhild(0);
	for (var index in data)
		addСhild(data[index].id);	
}
function addElement(id, text, point, allPoint) {
	var li = document.createElement('li');
	var span = document.createElement('span');
	li.id = 'treeId_' + id;
	li.appendChild(span).textContent = text + ' | ' + point + '$ ' + (allPoint > 0? ' | ' + (point + allPoint) + '$': ''  );
	return li;
}
function addСhild(id) {
	var ul = document.createElement('ul');
	var dom = ul;
	for (var index in data)
		if (data[index].parent === id)
			dom.appendChild(addElement(data[index].id, data[index].name, data[index].point, allPointSum(data[index].id)))
	var tree = document.getElementById('treeId_' + id);
	if (tree) {
		tree.appendChild(dom);
	} else {
		dom.appendChild(addElement(data[index].id, data[index].name, data[index].point))
		var tree = document.getElementById('treeId_0');
		tree.appendChild(dom);
	}
}

var tree = document.getElementsByTagName('ul')[0];
tree.onclick = function (event) {
	var target = event.target;
	if (target.tagName != 'SPAN') {
		return;
	}
	var li = target.parentNode;
	var childrenContainer = li.getElementsByTagName('ul')[0];
	if (!childrenContainer) return;
	childrenContainer.hidden = !childrenContainer.hidden;
}

function allPointSum(id, allPoint = 0) {
	for (var index in data) {
		if (data[index].parent === id) {
			allPoint += allPointSum(data[index].id, data[index].point);
		}
	}
	return allPoint
}