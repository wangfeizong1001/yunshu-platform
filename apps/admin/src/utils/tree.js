/**
 * 树形数据处理工具
 */
export const arrayToTree = (array, idKey = 'id', parentKey = 'parentId', childrenKey = 'children') => {
    const map = {};
    const result = [];
    array.forEach(item => {
        map[item[idKey]] = item;
    });
    array.forEach(item => {
        const parent = map[item[parentKey]];
        if (parent) {
            if (!parent[childrenKey]) {
                parent[childrenKey] = [];
            }
            parent[childrenKey].push(item);
        }
        else {
            result.push(item);
        }
    });
    return result;
};
export const treeToArray = (tree, childrenKey = 'children') => {
    const result = [];
    const traverse = (nodes) => {
        nodes.forEach(node => {
            const { [childrenKey]: children, ...rest } = node;
            result.push(rest);
            if (children && children.length) {
                traverse(children);
            }
        });
    };
    traverse(tree);
    return result;
};
export const findNodeById = (tree, id, idKey = 'id', childrenKey = 'children') => {
    for (const node of tree) {
        if (node[idKey] === id) {
            return node;
        }
        if (node[childrenKey] && node[childrenKey].length) {
            const found = findNodeById(node[childrenKey], id, idKey, childrenKey);
            if (found) {
                return found;
            }
        }
    }
    return null;
};
export const findParentIds = (tree, id, idKey = 'id', _parentKey = 'parentId', childrenKey = 'children') => {
    const parents = [];
    const traverse = (nodes, parentNode) => {
        for (const node of nodes) {
            if (node[idKey] === id) {
                if (parentNode) {
                    parents.push(parentNode[idKey]);
                    traverse(tree, parentNode);
                }
                return true;
            }
            if (node[childrenKey] && node[childrenKey].length) {
                if (traverse(node[childrenKey], node)) {
                    return true;
                }
            }
        }
        return false;
    };
    traverse(tree);
    return parents.reverse();
};
//# sourceMappingURL=tree.js.map