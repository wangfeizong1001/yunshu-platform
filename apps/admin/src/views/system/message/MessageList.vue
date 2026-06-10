<template>
  <div class="message-list">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
            <el-option label="系统消息" value="system" />
            <el-option label="普通消息" value="normal" />
            <el-option label="提醒消息" value="reminder" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="未读" value="0" />
            <el-option label="已读" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button
              v-has-permi="['system:message:add']"
              type="primary"
              :icon="Plus"
              @click="handleSend"
              >发消息</el-button
            >
            <el-button
              v-has-permi="['system:message:edit']"
              type="warning"
              :icon="DocumentChecked"
              @click="handleMarkAllRead"
              >全部已读</el-button
            >
            <el-button
              v-has-permi="['system:message:remove']"
              type="danger"
              :icon="Delete"
              :disabled="!selectedRows.length"
              @click="handleBatchDelete"
              >批量删除</el-button
            >
          </div>
          <div class="right">
            <el-badge :value="unreadCount" class="unread-badge">
              <el-button :icon="Bell" circle @click="refreshTable" />
            </el-badge>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="messageList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed />
        <el-table-column prop="messageId" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="message-title" :class="{ unread: row.status === '0' }">
              <el-icon v-if="row.status === '0'"><CircleCheckFilled /></el-icon>
              <span @click="handleView(row as MessageInfo)">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityTagType(row.priority)">
              {{ getPriorityLabel(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="senderName" label="发送人" width="120" />
        <el-table-column prop="sendTime" label="发送时间" width="180" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'warning' : 'success'">
              {{ row.status === '0' ? '未读' : '已读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row as MessageInfo)">查看</el-button>
            <el-button
              v-if="row.status === '0'"
              link
              type="success"
              @click="handleMarkRead(row as MessageInfo)"
              >标为已读</el-button
            >
            <el-button link type="danger" @click="handleDelete(row as MessageInfo)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <MessageForm v-model="formVisible" @refresh="handleQuery" />
    <MessageDetail
      v-model="detailVisible"
      :message-id="currentMessageId"
      @mark-read="handleMarkReadById"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Search, Refresh, Plus, Delete, DocumentChecked, Bell } from '@element-plus/icons-vue';
  import {
    getMessagePage,
    getUnreadMessageCount,
    deleteMessage,
    batchDeleteMessage,
    markAsRead,
    markAllAsRead,
    type MessageInfo,
  } from '@/api/system/message.api';
  import MessageForm from './MessageForm.vue';
  import MessageDetail from './MessageDetail.vue';

  const loading = ref(false);
  const messageList = ref<MessageInfo[]>([]);
  const total = ref(0);
  const unreadCount = ref(0);
  const selectedRows = ref<MessageInfo[]>([]);
  const formVisible = ref(false);
  const detailVisible = ref(false);
  const currentMessageId = ref<number | undefined>(undefined);

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    title: '',
    type: '',
    status: '',
  });

  async function fetchMessageList() {
    loading.value = true;
    try {
      const res = (await getMessagePage(queryParams)) as { rows: MessageInfo[]; total: number };
      messageList.value = res.rows || [];
      total.value = res.total || 0;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const count = (await getUnreadMessageCount()) as number;
      unreadCount.value = count;
    } catch (error) {
      console.error('获取未读数量失败:', error);
    }
  }

  function handleQuery() {
    queryParams.pageNum = 1;
    fetchMessageList();
    fetchUnreadCount();
  }

  function resetQuery() {
    queryParams.title = '';
    queryParams.type = '';
    queryParams.status = '';
    queryParams.pageNum = 1;
    handleQuery();
  }

  function refreshTable() {
    fetchMessageList();
    fetchUnreadCount();
  }

  function handleSend() {
    formVisible.value = true;
  }

  function handleView(row: MessageInfo) {
    currentMessageId.value = row.messageId;
    detailVisible.value = true;
  }

  async function handleMarkRead(row: MessageInfo) {
    try {
      await markAsRead(row.messageId);
      ElMessage.success('标记成功');
      fetchMessageList();
      fetchUnreadCount();
    } catch (error) {
      console.error('标记失败:', error);
    }
  }

  async function handleMarkReadById(messageId: number) {
    await handleMarkRead({ messageId } as MessageInfo);
  }

  async function handleMarkAllRead() {
    try {
      await ElMessageBox.confirm('确定将所有消息标记为已读吗？', '提示', { type: 'warning' });
      await markAllAsRead();
      ElMessage.success('全部标记成功');
      fetchMessageList();
      fetchUnreadCount();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('全部标记失败:', error);
      }
    }
  }

  async function handleDelete(row: MessageInfo) {
    try {
      await ElMessageBox.confirm('确定删除这条消息吗？', '提示', { type: 'warning' });
      await deleteMessage(row.messageId);
      ElMessage.success('删除成功');
      fetchMessageList();
      fetchUnreadCount();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error);
      }
    }
  }

  async function handleBatchDelete() {
    try {
      await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 条消息吗？`, '提示', {
        type: 'warning',
      });
      await batchDeleteMessage(selectedRows.value.map((row) => row.messageId));
      ElMessage.success('批量删除成功');
      fetchMessageList();
      fetchUnreadCount();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败:', error);
      }
    }
  }

  function handleSelectionChange(selection: MessageInfo[]) {
    selectedRows.value = selection;
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      system: '系统消息',
      normal: '普通消息',
      reminder: '提醒消息',
    };
    return labels[type] || type;
  }

  function getTypeTagType(type: string) {
    const types: Record<string, any> = {
      system: 'danger',
      normal: 'info',
      reminder: 'warning',
    };
    return types[type] || '';
  }

  function getPriorityLabel(priority: string) {
    const labels: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return labels[priority] || priority;
  }

  function getPriorityTagType(priority: string) {
    const types: Record<string, any> = {
      high: 'danger',
      medium: 'warning',
      low: 'info',
    };
    return types[priority] || '';
  }

  onMounted(() => {
    fetchMessageList();
    fetchUnreadCount();
  });
</script>

<style scoped lang="scss">
  .message-list {
    .search-card {
      margin-bottom: 16px;
    }

    .table-card {
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .unread-badge {
        margin-right: 8px;
      }
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .message-title {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;

      &.unread {
        font-weight: 600;
      }
    }
  }
</style>
