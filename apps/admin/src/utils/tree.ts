/**
 * 树形数据处理工具
 */

export interface TreeNode {
  id: unknown
  children?: TreeNode[]
  [key: string]: unknown
}

export const arrayToTree = (
  array: unknown[], idKey = 'id', parentKey = 'parentId', childrenKey = 'children') => {
  const map: Record<string, unknown> = {}
  const result: unknown[] = []
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

export const treeToArray = (tree: unknown[], childrenKey = 'children') => {
  const result: unknown[] = []
  const traverse = (nodes: unknown[]) => {
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

export const findNodeById = <T extends Record<string, unknown>>(tree: T[], id: unknown, idKey = 'id', childrenKey = 'children'): T | null => {
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

export const findParentIds = (tree: unknown[], id: unknown, idKey = 'id', _parentKey = 'parentId', childrenKey = 'children') => {
  const parents: unknown[] = []
  const traverse = (nodes: unknown[], parentNode?: unknown) => {
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

