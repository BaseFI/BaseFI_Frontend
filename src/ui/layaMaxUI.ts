/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class FunctionNodeSlot_ViewUI extends View {
		public m_Slot_Type_Label:Laya.Box;
		public m_Slot_Name_Text:Laya.Text;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("FunctionNodeSlot_View");
        }
    }
    REG("ui.FunctionNodeSlot_ViewUI",FunctionNodeSlot_ViewUI);
    export class FunctionNode_ViewUI extends View {
		public m_Node_Background:Laya.Sprite;
		public m_Node_Name_Label:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("FunctionNode_View");
        }
    }
    REG("ui.FunctionNode_ViewUI",FunctionNode_ViewUI);
    export class MainPageUI extends Scene {
		public m_Main_Panel:Laya.Panel;
		public m_InjectintButton:Laya.Button;
		public m_Object_ID_Text:Laya.Text;
		public m_Slot_Linking_Toggle:Laya.CheckBox;
		public m_Node_Delete_Button:Laya.Button;
		public m_Node_Script_Text:Laya.TextArea;
		public m_Node_Add_Button:Laya.Button;
		public m_Node_Attributes_List:Laya.List;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("MainPage");
        }
    }
    REG("ui.MainPageUI",MainPageUI);
}