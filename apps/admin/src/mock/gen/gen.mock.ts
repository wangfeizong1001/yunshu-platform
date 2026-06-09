/**
 * 代码生成器 Mock 数据
 *
 * @module @yunshu/admin/mock/gen
 */

import type { IGenTable, IGenColumn, IGenConfig, IGenPreview } from '@yunshu/shared'

/** Mock 数据库表数据 */
export const genTableMockData: IGenTable[] = [
  {
    tableName: 'sys_user',
    tableComment: '用户表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-15 08:00:00',
  },
  {
    tableName: 'sys_role',
    tableComment: '角色表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-10 10:00:00',
  },
  {
    tableName: 'sys_menu',
    tableComment: '菜单表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-08 09:00:00',
  },
  {
    tableName: 'sys_dept',
    tableComment: '部门表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-05 14:00:00',
  },
  {
    tableName: 'biz_order',
    tableComment: '订单表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-03-01 10:00:00',
  },
  {
    tableName: 'biz_product',
    tableComment: '产品表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-03-05 09:00:00',
  },
]

/** Mock 字段数据 */
export const genColumnMockData: IGenColumn[] = [
  {
    columnName: 'user_id',
    dataType: 'bigint',
    columnComment: '用户ID',
    isNullable: 'NO',
    isPK: true,
    columnLength: 20,
    javaType: 'Long',
    javaField: 'userId',
    isFill: false,
    idType: 'AUTO',
  },
  {
    columnName: 'username',
    dataType: 'varchar',
    columnComment: '用户名',
    isNullable: 'NO',
    isPK: false,
    columnLength: 50,
    javaType: 'String',
    javaField: 'username',
    isFill: false,
    queryType: 'eq',
  },
  {
    columnName: 'nick_name',
    dataType: 'varchar',
    columnComment: '昵称',
    isNullable: 'YES',
    isPK: false,
    columnLength: 50,
    javaType: 'String',
    javaField: 'nickName',
    isFill: false,
    queryType: 'like',
  },
  {
    columnName: 'email',
    dataType: 'varchar',
    columnComment: '邮箱',
    isNullable: 'YES',
    isPK: false,
    columnLength: 100,
    javaType: 'String',
    javaField: 'email',
    isFill: false,
    queryType: 'like',
  },
  {
    columnName: 'phone',
    dataType: 'varchar',
    columnComment: '手机号',
    isNullable: 'YES',
    isPK: false,
    columnLength: 20,
    javaType: 'String',
    javaField: 'phone',
    isFill: false,
    queryType: 'like',
  },
  {
    columnName: 'sex',
    dataType: 'char',
    columnComment: '性别（0男 1女 2未知）',
    isNullable: 'YES',
    isPK: false,
    columnLength: 1,
    javaType: 'String',
    javaField: 'sex',
    isFill: false,
    displayType: 'select',
    dictType: 'sys_user_sex',
  },
  {
    columnName: 'status',
    dataType: 'char',
    columnComment: '状态（0正常 1停用）',
    isNullable: 'YES',
    isPK: false,
    columnLength: 1,
    javaType: 'String',
    javaField: 'status',
    isFill: false,
    displayType: 'radio',
    dictType: 'sys_normal_disable',
  },
  {
    columnName: 'create_by',
    dataType: 'varchar',
    columnComment: '创建者',
    isNullable: 'YES',
    isPK: false,
    columnLength: 64,
    javaType: 'String',
    javaField: 'createBy',
    isFill: true,
  },
  {
    columnName: 'create_time',
    dataType: 'datetime',
    columnComment: '创建时间',
    isNullable: 'YES',
    isPK: false,
    javaType: 'LocalDateTime',
    javaField: 'createTime',
    isFill: true,
  },
  {
    columnName: 'update_by',
    dataType: 'varchar',
    columnComment: '更新者',
    isNullable: 'YES',
    isPK: false,
    columnLength: 64,
    javaType: 'String',
    javaField: 'updateBy',
    isFill: true,
  },
  {
    columnName: 'update_time',
    dataType: 'datetime',
    columnComment: '更新时间',
    isNullable: 'YES',
    isPK: false,
    javaType: 'LocalDateTime',
    javaField: 'updateTime',
    isFill: true,
  },
  {
    columnName: 'remark',
    dataType: 'text',
    columnComment: '备注',
    isNullable: 'YES',
    isPK: false,
    javaType: 'String',
    javaField: 'remark',
    isFill: false,
    displayType: 'textarea',
  },
]

/** Mock 生成配置 */
export const genConfigMockData: IGenConfig = {
  tableName: 'sys_user',
  tableComment: '用户表',
  className: 'SysUser',
  moduleName: 'system',
  packageName: 'com.yunshu.system',
  author: '云枢',
  email: 'yunshu@example.com',
  generateType: 'single',
  generateMenu: true,
  generateApi: true,
  generateView: true,
  generateTypeScript: true,
  businessName: '用户管理',
  functionName: '用户管理',
}

/** Mock 代码预览数据 */
export const genPreviewMockData: IGenPreview = {
  tableName: 'sys_user',
  files: [
    {
      fileName: 'SysUserController.java',
      filePath: 'com/yunshu/system/controller/SysUserController.java',
      content: `package com.yunshu.system.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunshu.system.dto.SysUserDTO;
import com.yunshu.system.entity.SysUser;
import com.yunshu.system.service.ISysUserService;
import com.yunshu.system.vo.SysUserVO;
import com.yunshu.core.response.ApiResponse;
import com.yunshu.core.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 *
 * @author 云枢
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/system/sysUser")
public class SysUserController {

    private final ISysUserService sysUserService;

    /**
     * 获取用户分页列表
     */
    @GetMapping("/page")
    public PagedResponse<SysUserVO> getPage(
            SysUserDTO dto,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        Page<SysUser> result = sysUserService.selectPage(dto, page, limit);
        return PagedResponse.ok(result);
    }
}`,
    },
    {
      fileName: 'ISysUserService.java',
      filePath: 'com/yunshu/system/service/ISysUserService.java',
      content: `package com.yunshu.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yunshu.system.dto.SysUserDTO;
import com.yunshu.system.entity.SysUser;
import com.yunshu.system.vo.SysUserVO;

import java.util.List;

/**
 * 用户服务接口
 *
 * @author 云枢
 */
public interface ISysUserService extends IService<SysUser> {

    IPage<SysUser> selectPage(SysUserDTO dto, Integer page, Integer limit);

    List<SysUserVO> selectList(SysUserDTO dto);

    SysUserVO selectById(Long userId);

    boolean create(SysUserDTO dto);

    boolean update(SysUserDTO dto);

    boolean delete(Long userId);

    int deleteBatch(List<Long> ids);
}`,
    },
    {
      fileName: 'sys_user.api.ts',
      filePath: 'api/system/sys_user.api.ts',
      content: `/**
 * 用户管理 API
 *
 * @author 云枢
 */

import { request } from '@/utils/request'
import type { ApiResponse, PaginatedResponse } from '@yunshu/shared'
import type { ISysUser, ISysUserQuery } from '@/types/system/sys_user.types'

export type SysUserPageResp = PaginatedResponse<ISysUser>

export function getSysUserPage(params: ISysUserQuery) {
  return request<SysUserPageResp>({
    url: '/system/sysUser/page',
    method: 'get',
    params,
  })
}

export function getSysUserList(params?: ISysUserQuery) {
  return request<ApiResponse<ISysUser[]>>({
    url: '/system/sysUser/list',
    method: 'get',
    params,
  })
}

export function getSysUserDetail(userId: number) {
  return request<ApiResponse<ISysUser>>({
    url: \`/system/sysUser/\${userId}\`,
    method: 'get',
  })
}

export function createSysUser(data: Partial<ISysUser>) {
  return request<ApiResponse<boolean>>({
    url: '/system/sysUser',
    method: 'post',
    data,
  })
}

export function updateSysUser(userId: number, data: Partial<ISysUser>) {
  return request<ApiResponse<boolean>>({
    url: \`/system/sysUser/\${userId}\`,
    method: 'put',
    data,
  })
}

export function deleteSysUser(userId: number) {
  return request<ApiResponse<boolean>>({
    url: \`/system/sysUser/\${userId}\`,
    method: 'delete',
  })
}`,
    },
  ],
}
