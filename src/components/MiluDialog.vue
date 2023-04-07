<template>
  <el-dialog v-bind="$attrs" append-to-body class="milu-dialog" width="400px" draggable align-center>
    <template v-if="$attrs.title" #header>
      <div class="milu-dialog-header">
        {{ $attrs.title }}
      </div>
    </template>
    <el-scrollbar max-height="calc(80vh - 60px)">
      <div class="milu-dialog__content">
        <slot></slot>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
export default {
  name: 'MiluDialog',
};
</script>
<style lang="scss">
.milu-dialog {
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  background-color: var(--bg-color-card);
  overflow: hidden;
  max-width: calc(100% - 40px);
  .el-dialog__header {
    padding: 0;
    .milu-dialog-header {
      padding: 20px;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      text-align: center;
    }
    margin-right: 0;
    .el-dialog__headerbtn {
      z-index: 99;
      width: 20px;
      height: 20px;
      top: 10px;
      right: 10px;
      .el-dialog__close {
        font-size: 20px;
        color: var(--font-color);
        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    .milu-dialog__content {
      padding: 0;
    }
  }
}
.milu-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  pointer-events: none;
  .milu-drawer {
    pointer-events: auto;
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    background-color: var(--bg-color-header);
    transform: translateX(-100%);
    transition: transform 0.2s;
    border-right: 1px solid var(--border-color-card);
    .milu-drawer-body {
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .list-wrap {
        padding: 20px 16px;
        .list {
          padding: 6px;
          letter-spacing: 0.5px;
          white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
          .anchor {
            padding: 2px 4px;
            border-radius: 3px;
            cursor: pointer;
            &.active {
              color: var(--primary-color);
            }
            &:hover {
              color: #fff;
              background: var(--primary-color);
            }
          }
        }
      }
    }

    .fixed-menu {
      position: absolute;
      bottom: 50px;
      width: 34px;
      height: 32px;
      left: 100%;
      transition: left 0.2s;
      border-radius: 0 16px 16px 0;
      background-color: var(--bg-color-card);
      // border: 1px solid var(--border-color-card);
      cursor: pointer;
      will-change: left;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2500;
      box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
    }
  }
  &.active {
    pointer-events: auto;
    .milu-drawer {
      transform: translateX(0);
    }
    .fixed-menu {
      left: calc(100% - 33px);
      border-radius: 16px 0 0 16px;
    }
  }
}
</style>
