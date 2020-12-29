import Vue from 'vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
;(ElementUI.TableColumn as any).props.align.default = 'center'
;(ElementUI.Dialog as any).props.closeOnClickModal.default = false
;(ElementUI.Dialog as any).props.closeOnPressEscape.default = false
