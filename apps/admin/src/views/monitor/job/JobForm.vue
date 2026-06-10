<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="600px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="formData.jobName" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="任务分组" prop="jobGroup">
        <el-select v-model="formData.jobGroup" placeholder="请选择任务分组" style="width: 100%">
          <el-option label="默认" value="default" />
          <el-option label="系统" value="system" />
          <el-option label="自定义" value="custom" />
        </el-select>
      </el-form-item>
      <el-form-item label="调用目标" prop="invokeTarget">
        <el-input v-model="formData.invokeTarget" placeholder="请输入调用目标" />
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input
          v-model="formData.cronExpression"
          placeholder="请输入cron表达式, 如: 0 0 2 * * ?"
        />
      </el-form-item>
      <el-form-item label="执行策略" prop="misfirePolicy">
        <el-select
          v-model="formData.misfirePolicy"
          placeholder="请选择执行策略"
          style="width: 100%"
        >
          <el-option label="默认策略" value="0" />
          <el-option label="立即执行" value="1" />
          <el-option label="执行一次" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="并发执行" prop="concurrent">
        <el-radio-group v-model="formData.concurrent">
          <el-radio label="0">允许并发</el-radio>
          <el-radio label="1">禁止并发</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">暂停</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import type { IJob } from '@yunshu/shared';
  import type { JobForm } from '@/api/monitor/job.api';
  import * as jobApi from '@/api/monitor/job.api';

  const props = defineProps<{
    modelValue: boolean;
    jobData: IJob | null;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'success'): void;
  }>();

  const formRef = ref();
  const submitLoading = ref(false);

  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const isEdit = computed(() => !!props.jobData);

  const formData = ref<JobForm>({
    jobName: '',
    jobGroup: 'default',
    cronExpression: '',
    concurrent: '0',
    status: '0',
    remark: '',
    invokeTarget: '',
    misfirePolicy: '0',
  });

  const rules = {
    jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    jobGroup: [{ required: true, message: '请选择任务分组', trigger: 'change' }],
    cronExpression: [{ required: true, message: '请输入cron表达式', trigger: 'blur' }],
  };

  watch(
    () => props.jobData,
    (val) => {
      if (val) {
        const jobInfo = val as unknown as JobForm;
        formData.value = {
          jobId: Number(val.jobId),
          jobName: val.jobName,
          jobGroup: val.jobGroup,
          cronExpression: val.cronExpression,
          concurrent: val.concurrent,
          status: val.status,
          remark: val.remark || '',
          targetBean: jobInfo.targetBean || '',
          targetMethod: jobInfo.targetMethod || '',
          invokeTarget: (val as any).invokeTarget || '',
          misfirePolicy: (val as any).misfirePolicy || '0',
        };
      } else {
        formData.value = {
          jobName: '',
          jobGroup: 'default',
          cronExpression: '',
          concurrent: '0',
          status: '0',
          remark: '',
          invokeTarget: '',
          misfirePolicy: '0',
        };
      }
    },
    { immediate: true },
  );

  const handleClose = () => {
    formRef.value?.resetFields();
    visible.value = false;
  };

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();
      submitLoading.value = true;

      if (isEdit.value) {
        await jobApi.updateJob(formData.value);
        ElMessage.success('更新成功');
      } else {
        await jobApi.addJob(formData.value);
        ElMessage.success('创建成功');
      }

      emit('success');
      handleClose();
    } catch {
      // 校验失败
    } finally {
      submitLoading.value = false;
    }
  };
</script>
