<template>
  <div class="comment-box">
    <div
      contenteditable="true"
      class="comment-input"
      @input="onInput"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      ref="inputRef"
    ></div>
    <button
      class="submit-btn"
      @click="$emit('submit', value)"
      :disabled="!value"
    >
      发送
    </button>
  </div>
</template>

<script lang="ts">
import { Comment } from '@/types'
import { defineComponent, PropType, ref, watch, computed } from 'vue'
import { useAuth } from '@/hooks/useAuth'
export default defineComponent({
  props: {
    value: String,
    replyTarget: {
      type: Object as PropType<Comment>
    }
  },
  emits: ['submit', 'update:value', 'blur'],
  setup(props, { emit }) {
    const { account, toggleLoginBox } = useAuth()
    const islocked = ref(false)
    const inputRef = ref<HTMLDivElement | null>(null)
    function onInput() {
      const el = inputRef.value
      if (el) {
        emit('update:value', el.innerHTML)
      }
    }
    function onFocus() {
      islocked.value = true
      if (!account.value) {
        toggleLoginBox(true)
      }
    }
    function onBlur(e: FocusEvent) {
      islocked.value = false
      if (!e.relatedTarget) {
        emit('blur')
      }
    }
    const placeholder = computed(() => {
      return props.replyTarget
        ? `回复${props.replyTarget.user.nickname}:`
        : '千头万绪，落笔汇成评论一句'
    })
    watch(
      () => props.value,
      value => {
        if (!islocked.value) {
          const el = inputRef.value
          if (el) {
            el.innerHTML = value || ''
          }
        }
      }
    )
    watch(
      () => props.replyTarget,
      value => {
        value && inputRef.value && inputRef.value.focus()
      }
    )
    return {
      inputRef,
      onInput,
      onFocus,
      onBlur,
      placeholder
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-box {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: $player-index + 1;
  background: $module-bg;
  padding: $padding-lg;
  display: flex;
  align-items: flex-end;
  .comment-input {
    flex: 1;
    margin-right: $gap;
    max-height: 60px;
    overflow: hidden;
    &:focus {
      outline: none;
    }
  }
  .submit-btn {
    background: transparent;
  }
  .comment-input {
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
    &[contenteditable='true'] {
      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
      }
    }
  }
}
</style>
