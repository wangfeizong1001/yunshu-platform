# OpenAPI 规范

云枢中台 OpenAPI 3.0 规范文档。

## 概述

本文档遵循 OpenAPI 3.0 规范，定义了云枢中台 API 的完整接口规范。

## 完整规范

```yaml
openapi: 3.0.3
info:
  title: 云枢中台 API
  description: |
    云枢中台是一套开箱即用的中台前端/设计解决方案。
    
    ## 认证方式
    本 API 使用 Bearer Token 进行认证。
    
    ```http
    Authorization: Bearer <token>
    ```
  version: 1.0.0
  contact:
    name: 云枢技术支持
    email: support@yunshu.dev
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.yunshu.dev
    description: 生产环境
  - url: https://api-staging.yunshu.dev
    description: 预发布环境
  - url: http://localhost:3000
    description: 开发环境

tags:
  - name: 认证
    description: 用户认证相关接口
  - name: 用户
    description: 用户管理相关接口
  - name: 角色
    description: 角色管理相关接口
  - name: 菜单
    description: 菜单管理相关接口
  - name: 权限
    description: 权限管理相关接口
  - name: 日志
    description: 系统日志相关接口

paths:
  # ============ 认证接口 ============
  /auth/login:
    post:
      tags:
        - 认证
      summary: 用户登录
      description: 用户登录系统，获取访问令牌
      operationId: login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: 登录成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'

  /auth/logout:
    post:
      tags:
        - 认证
      summary: 退出登录
      security:
        - BearerAuth: []
      responses:
        '200':
          description: 退出成功

  /auth/refresh:
    post:
      tags:
        - 认证
      summary: 刷新令牌
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefreshTokenRequest'
      responses:
        '200':
          description: 刷新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefreshTokenResponse'

  # ============ 用户接口 ============
  /users:
    get:
      tags:
        - 用户
      summary: 获取用户列表
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
        - name: username
          in: query
          schema:
            type: string
          description: 用户名（模糊搜索）
        - name: status
          in: query
          schema:
            type: integer
            enum: [0, 1]
          description: 状态
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

    post:
      tags:
        - 用户
      summary: 创建用户
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

  /users/{id}:
    get:
      tags:
        - 用户
      summary: 获取用户详情
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

    put:
      tags:
        - 用户
      summary: 更新用户
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

    delete:
      tags:
        - 用户
      summary: 删除用户
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: 删除成功

  /users/{id}/password:
    put:
      tags:
        - 用户
      summary: 修改密码
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChangePasswordRequest'
      responses:
        '200':
          description: 修改成功

  # ============ 角色接口 ============
  /roles:
    get:
      tags:
        - 角色
      summary: 获取角色列表
      security:
        - BearerAuth: []
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RoleListResponse'

    post:
      tags:
        - 角色
      summary: 创建角色
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRoleRequest'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RoleResponse'

  /roles/{id}:
    get:
      tags:
        - 角色
      summary: 获取角色详情
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RoleResponse'

    put:
      tags:
        - 角色
      summary: 更新角色
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateRoleRequest'
      responses:
        '200':
          description: 更新成功

    delete:
      tags:
        - 角色
      summary: 删除角色
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: 删除成功

  # ============ 菜单接口 ============
  /menus:
    get:
      tags:
        - 菜单
      summary: 获取菜单列表
      security:
        - BearerAuth: []
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuListResponse'

    post:
      tags:
        - 菜单
      summary: 创建菜单
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMenuRequest'
      responses:
        '201':
          description: 创建成功

  /menus/{id}:
    put:
      tags:
        - 菜单
      summary: 更新菜单
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateMenuRequest'
      responses:
        '200':
          description: 更新成功

    delete:
      tags:
        - 菜单
      summary: 删除菜单
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: 删除成功

  # ============ 日志接口 ============
  /logs/login:
    get:
      tags:
        - 日志
      summary: 获取登录日志
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
        - name: username
          in: query
          schema:
            type: string
        - name: startTime
          in: query
          schema:
            type: string
            format: date-time
        - name: endTime
          in: query
          schema:
            type: string
            format: date-time
      responses:
        '200':
          description: 成功

  /logs/operation:
    get:
      tags:
        - 日志
      summary: 获取操作日志
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: 成功

# ============ 组件定义 ============
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
      description: 页码

    PageSize:
      name: pageSize
      in: query
      schema:
        type: integer
        default: 10
        maximum: 100
      description: 每页数量

  schemas:
    # ============ 请求 Schema ============
    LoginRequest:
      type: object
      required:
        - username
        - password
      properties:
        username:
          type: string
          description: 用户名
          example: admin
        password:
          type: string
          description: 密码（MD5 加密）
          example: e10adc3949ba59abbe56e057f20f883e

    RefreshTokenRequest:
      type: object
      required:
        - refreshToken
      properties:
        refreshToken:
          type: string
          description: 刷新令牌

    CreateUserRequest:
      type: object
      required:
        - username
        - password
        - realName
        - email
        - roleIds
      properties:
        username:
          type: string
          description: 用户名
        password:
          type: string
          description: 密码
        realName:
          type: string
          description: 真实姓名
        email:
          type: string
          format: email
          description: 邮箱
        phone:
          type: string
          description: 手机号
        roleIds:
          type: array
          items:
            type: string
          description: 角色 ID 列表
        status:
          type: integer
          enum: [0, 1]
          default: 1
          description: 状态

    UpdateUserRequest:
      type: object
      properties:
        realName:
          type: string
          description: 真实姓名
        email:
          type: string
          format: email
          description: 邮箱
        phone:
          type: string
          description: 手机号
        roleIds:
          type: array
          items:
            type: string
          description: 角色 ID 列表
        status:
          type: integer
          enum: [0, 1]
          description: 状态

    ChangePasswordRequest:
      type: object
      required:
        - oldPassword
        - newPassword
      properties:
        oldPassword:
          type: string
          description: 旧密码
        newPassword:
          type: string
          description: 新密码

    CreateRoleRequest:
      type: object
      required:
        - name
        - code
        - menuIds
      properties:
        name:
          type: string
          description: 角色名称
        code:
          type: string
          description: 角色编码
        description:
          type: string
          description: 描述
        status:
          type: integer
          enum: [0, 1]
          default: 1
        menuIds:
          type: array
          items:
            type: string
          description: 菜单 ID 列表
        dataScope:
          type: integer
          description: 数据权限范围

    UpdateRoleRequest:
      type: object
      properties:
        name:
          type: string
          description: 角色名称
        description:
          type: string
          description: 描述
        status:
          type: integer
          enum: [0, 1]
        menuIds:
          type: array
          items:
            type: string
          description: 菜单 ID 列表
        dataScope:
          type: integer
          description: 数据权限范围

    CreateMenuRequest:
      type: object
      required:
        - parentId
        - name
        - path
        - type
      properties:
        parentId:
          type: string
          description: 父菜单 ID
        name:
          type: string
          description: 菜单名称
        path:
          type: string
          description: 路由路径
        icon:
          type: string
          description: 图标
        sort:
          type: integer
          description: 排序
        permission:
          type: string
          description: 权限标识
        type:
          type: integer
          enum: [1, 2, 3]
          description: 类型：1-目录，2-菜单，3-按钮
        status:
          type: integer
          enum: [0, 1]
          default: 1

    UpdateMenuRequest:
      type: object
      properties:
        parentId:
          type: string
          description: 父菜单 ID
        name:
          type: string
          description: 菜单名称
        path:
          type: string
          description: 路由路径
        icon:
          type: string
          description: 图标
        sort:
          type: integer
          description: 排序
        permission:
          type: string
          description: 权限标识
        status:
          type: integer
          enum: [0, 1]

    # ============ 响应 Schema ============
    LoginResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: object
          properties:
            token:
              type: string
              description: 访问令牌
            refreshToken:
              type: string
              description: 刷新令牌
            expiresIn:
              type: integer
              description: 有效期（秒）
            user:
              $ref: '#/components/schemas/User'

    RefreshTokenResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: object
          properties:
            token:
              type: string
            refreshToken:
              type: string
            expiresIn:
              type: integer

    UserResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          $ref: '#/components/schemas/User'

    UserListResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: object
          properties:
            list:
              type: array
              items:
                $ref: '#/components/schemas/User'
            pagination:
              $ref: '#/components/schemas/Pagination'

    RoleResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          $ref: '#/components/schemas/Role'

    RoleListResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: array
          items:
            $ref: '#/components/schemas/Role'

    MenuListResponse:
      type: object
      properties:
        code:
          type: integer
          example: 200
        message:
          type: string
          example: success
        data:
          type: array
          items:
            $ref: '#/components/schemas/Menu'

    # ============ 数据模型 ============
    User:
      type: object
      properties:
        id:
          type: string
          description: 用户 ID
        username:
          type: string
          description: 用户名
        realName:
          type: string
          description: 真实姓名
        email:
          type: string
          format: email
          description: 邮箱
        phone:
          type: string
          description: 手机号
        avatar:
          type: string
          description: 头像 URL
        status:
          type: integer
          enum: [0, 1]
          description: 状态
        roles:
          type: array
          items:
            $ref: '#/components/schemas/Role'
          description: 角色列表
        createTime:
          type: string
          format: date-time
          description: 创建时间
        lastLoginTime:
          type: string
          format: date-time
          description: 最后登录时间

    Role:
      type: object
      properties:
        id:
          type: string
          description: 角色 ID
        name:
          type: string
          description: 角色名称
        code:
          type: string
          description: 角色编码
        description:
          type: string
          description: 描述
        status:
          type: integer
          enum: [0, 1]
          description: 状态
        createTime:
          type: string
          format: date-time
          description: 创建时间

    Menu:
      type: object
      properties:
        id:
          type: string
          description: 菜单 ID
        parentId:
          type: string
          description: 父菜单 ID
        name:
          type: string
          description: 菜单名称
        path:
          type: string
          description: 路由路径
        icon:
          type: string
          description: 图标
        sort:
          type: integer
          description: 排序
        permission:
          type: string
          description: 权限标识
        type:
          type: integer
          enum: [1, 2, 3]
          description: 类型
        status:
          type: integer
          enum: [0, 1]
          description: 状态
        children:
          type: array
          items:
            $ref: '#/components/schemas/Menu'
          description: 子菜单

    Pagination:
      type: object
      properties:
        page:
          type: integer
          description: 当前页码
        pageSize:
          type: integer
          description: 每页数量
        total:
          type: integer
          description: 总记录数
        totalPages:
          type: integer
          description: 总页数
