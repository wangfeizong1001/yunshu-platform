<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑套餐' : '新增套餐'"
    width="700px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="套餐名称" prop="packageName">
            <el-input v-model="formData.packageName" placeholder="请输入套餐名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐类型" prop="packageType">
            <el-select
              v-model="formData.packageType"
              placeholder="请选择套餐类型"
              style="width: 100%"
            >
              <el-option label="免费版" value="0" />
              <el-option label="基础版" value="1" />
              <el-option label="高级版" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户限制" prop="userLimit">
            <el-input-number
              v-model="formData.userLimit"
              :min="1"
              :max="999999"
              placeholder="请输入用户限制"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储限制(MB)" prop="storageLimit">
            <el-input-number
              v-model="formData.storageLimit"
              :min="0"
              :max="99999999"
              placeholder="请输入存储限制"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="月流量限制(GB)" prop="flowLimit">
            <el-input-number
              v-model="formData.flowLimit"
              :min="0"
              :max="999999"
              placeholder="请输入月流量限制"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格(元)" prop="price">
            <el-input-number
              v-model="formData.price"
              :min="0"
              :precision="2"
              placeholder="请输入价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="过期类型" prop="expireType">
            <el-select
              v-model="formData.expireType"
              placeholder="请选择过期类型"
              style="width: 100%"
            >
              <el-option label="永久" value="0" />
              <el-option label="年费" value="1" />
              <el-option label="月费" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData.expireType !== '0'" label="过期时间" prop="expireTime">
            <el-date-picker
              v-model="formData.expireTime"
              type="datetime"
              placeholder="请选择过期时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="0">正常</el-radio>
          <el-radio value="1">停用</el-radio>
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
  import type { FormInstance, FormRules } from 'element-plus';
  import { addPackage, updatePackage } from '@/api/tenant/tenant.api';
  import type { TenantPackage, TenantPackageForm } from '@yunshu/shared';

  const props = defineProps<{
    modelValue: boolean;
    packageData?: TenantPackage | null;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    refresh: [];
  }>();

  // 状态
  const formRef = ref<FormInstance>();
  const submitLoading = ref(false);

  // 计算属性
  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const isEdit = computed(() => !!props.packageData?.packageId);

  // 表单数据
  const formData = ref<TenantPackageForm>({
    packageName: '',
    packageType: '0',
    menuIds: [],
    expireType: '0',
    expireTime: '',
    userLimit: 100,
    storageLimit: 1024,
    flowLimit: 10,
    price: 0,
    status: '0',
    remark: '',
  });

  // 表单验证规则
  const rules: FormRules = {
    packageName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
    packageType: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
    userLimit: [{ required: true, message: '请输入用户限制', trigger: 'blur' }],
    expireType: [{ required: true, message: '请选择过期类型', trigger: 'change' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  };

  // 监听数据变化
  watch(
    () => props.packageData,
    (val) => {
      if (val) {
        formData.value = {
          packageId: val.packageId,
          packageName: val.packageName,
          packageType: val.packageType,
          menuIds: val.menuIds,
          expireType: val.expireType,
          expireTime: val.expireTime,
          userLimit: val.userLimit,
          storageLimit: val.storageLimit,
          flowLimit: val.flowLimit,
          price: val.price,
          status: val.status,
          remark: val.remark,
        };
      } else {
        formData.value = {
          packageName: '',
          packageType: '0',
          menuIds: [],
          expireType: '0',
          expireTime: '',
          userLimit: 100,
          storageLimit: 1024,
          flowLimit: 10,
          price: 0,
          status: '0',
          remark: '',
        };
      }
    },
    { immediate: true },
  );

  // 关闭弹窗
  function handleClose() {
    visible.value = false;
    formRef.value?.resetFields();
  }

  // 提交表单
  async function handleSubmit() {
    try {
      await formRef.value?.validate();
      submitLoading.value = true;

      if (isEdit.value) {
        await updatePackage(props.packageData!.packageId, formData.value);
        ElMessage.success('修改成功');
      } else {
        await addPackage(formData.value);
        ElMessage.success('新增成功');
      }

      emit('refresh');
      handleClose();
    } catch (error) {
      console.error('提交失败', error);
    } finally {
      submitLoading.value = false;
    }
  }
</script>
