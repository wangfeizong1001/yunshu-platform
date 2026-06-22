/**
 * 树形数据处理工具
 */

export interface TreeNode {
  id: unknown
  children?: TreeNode[]
  [key: string]: unknown
}

export const arrayToTree = (
  array: Record<string, unknown>[], idKey = 'id', parentKey = 'parentId', childrenKey = 'children') => {
  const map: Record<string, Record<string, unknown>> = {}
  const result: Record<string, unknown>[] = []
  array.forEach(item => {
    map[item[idKey] as string] = item
  })
  array.forEach(item => {
    const parent = map[item[parentKey] as string]
    if (parent) {
      if (!parent[childrenKey]) {
        parent[childrenKey] = []
      }
      ;(parent[childrenKey] as Record<string, unknown>[]).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export const treeToArray = (tree: Record<string, unknown>[], childrenKey = 'children') => {
  const result: Record<string, unknown>[] = []
  const traverse = (nodes: Record<string, unknown>[]) => {
    nodes.forEach(node => {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest)
      if (children && (children as Record<string, unknown>[]).length) {
        traverse(children as Record<string, unknown>[])
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
    if (node[childrenKey] && (node[childrenKey] as T[]).length) {
      const found = findNodeById(node[childrenKey] as T[], id, idKey, childrenKey)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const findParentIds = (tree: Record<string, unknown>[], id: unknown, idKey = 'id', _parentKey = 'parentId', childrenKey = 'children') => {
  const parents: unknown[] = []
  const traverse = (nodes: Record<string, unknown>[], parentNode?: Record<string, unknown>) => {
    for (const node of nodes) {
      if (node[idKey] === id) {
        if (parentNode) {
          parents.push(parentNode[idKey])
          traverse(tree, parentNode)
        }
        return true
      }
      if (node[childrenKey] && (node[childrenKey] as Record<string, unknown>[]).length) {
        if (traverse(node[childrenKey] as Record<string, unknown>[], node)) {
          return true
        }
      }
    }
    return false
  }
  traverse(tree)
  return parents.reverse()
}
