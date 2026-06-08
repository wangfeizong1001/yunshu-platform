/**
 * 树形数据处理工具
 */

export interface TreeNode {
  id: any
  children?: TreeNode[]
  [key: string]: any
}

export const arrayToTree = (
  array: any[], idKey = 'id', parentKey = 'parentId', childrenKey = 'children') => {
  const map: any = {}
  const result: any[] = []
  array.forEach(item => {
    map[item[idKey]] = item
  })
  array.forEach(item => {
    const parent = map[item[parentKey]]
    if (parent) {
      if (!parent[childrenKey]) {
        parent[childrenKey] = []
      }
      parent[childrenKey].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export const treeToArray = (tree: any[], childrenKey = 'children') => {
  const result: any[] = []
  const traverse = (nodes: any[]) => {
    nodes.forEach(node => {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest)
      if (children && children.length) {
        traverse(children)
      }
    })
  }
  traverse(tree)
  return result
}

export const findNodeById = <T extends Record<string, any>>(tree: T[], id: any, idKey = 'id', childrenKey = 'children'): T | null => {
  for (const node of tree) {
    if (node[idKey] === id) {
      return node
    }
    if (node[childrenKey] && node[childrenKey].length) {
      const found = findNodeById(node[childrenKey], id, idKey, childrenKey) as T | null
      if (found) {
        return found
      }
    }
  }
  return null
}

export const findParentIds = (tree: any[], id: any, idKey = 'id', _parentKey = 'parentId', childrenKey = 'children') => {
  const parents: any[] = []
  const traverse = (nodes: any[], parentNode?: any) => {
    for (const node of nodes) {
      if (node[idKey] === id) {
        if (parentNode) {
          parents.push(parentNode[idKey])
          traverse(tree, parentNode)
        }
        return true
      }
      if (node[childrenKey] && node[childrenKey].length) {
        if (traverse(node[childrenKey], node)) {
          return true
        }
      }
    }
    return false
  }
  traverse(tree)
  return parents.reverse()
}

