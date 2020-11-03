import FunctionNodeSlot_Runtime from "./FunctionNodeSlot_Runtime";
import FunctionNode_Runtime from "./FunctionNode_Runtime";
import MainPage_Runtime from "./MainPage_Runtime";
import { ui } from "./ui/layaMaxUI";

export default class MainPage_Runtime_Toolbar_Init
{
    m_MainPage_Runtime:MainPage_Runtime;
    m_Last_Clicked_Slot:FunctionNodeSlot_Runtime=null;
    m_Last_Clicked_Node:FunctionNode_Runtime=null;

    Init()
    {
        this.m_MainPage_Runtime. m_Main_Panel.on("NODE_CLICKED",this,this.On_Node_Clicked);
        this.m_MainPage_Runtime. m_Main_Panel.on("SLOT_CLICKED",this,this.On_Slot_Clicked);
        this.m_MainPage_Runtime. m_Node_Add_Button.on(Laya.Event.CLICK,this,this.On_Add_Node_Button_Clicked);
        this.m_MainPage_Runtime. m_Node_Delete_Button.on(Laya.Event.CLICK,this,this.On_Delete_Node_Button_Clicked);

        let list=this.m_MainPage_Runtime.m_Node_Attributes_List;
        list.itemRender = Node_Attribute_Item;
        list.repeatX = 1;
        list.repeatY = 4;
     
        debugger;
        // 使用但隐藏滚动条
        //list.vScrollBarSkin = "";
        list.selectEnable = true;
        
        list.selectHandler = new Laya.Handler(this, this.onSelect);
        list.renderHandler = new Laya.Handler(this, this.updateItem);
        
        // 设置数据项为对应图片的路径
        var data: Array<Slot_Attribute_Model> = [];
        for (var i: number = 0; i < 1; i++) {
            //data.push("res/ui/listskins/1.jpg");
            //data.push("res/ui/listskins/2.jpg");
            //data.push("res/ui/listskins/3.jpg");
            //data.push("res/ui/listskins/4.jpg");
            //data.push("res/ui/listskins/5.jpg");
        }
        list.array = data;


    }
    private updateItem(cell: Node_Attribute_Item, index: number): void {
        cell.Update(cell.dataSource);
    }
    private onSelect(index: number): void {
        console.log("当前选择的索引：" + index);
    }
    On_Delete_Node_Button_Clicked()
    {
        this.m_MainPage_Runtime.Delete_Node(this.m_Last_Clicked_Node.m_ID);
        this.m_MainPage_Runtime.Repaint_Lines();
    }
    On_Add_Node_Button_Clicked()
    {

        let t_script:string=this.m_MainPage_Runtime.m_Node_Script_Text.text;
        let t_script_row_split:string[]=t_script.split("\n");

        let t_width:number =300,t_height:number=300;
/*
@NODE01
@NODE_SIZE 400 400
@SLOT 0 120 S01 INPUT INT 0 0
@SLOT 0 220 S02 INPUT INT 2 0

@NODE02
@NODE_SIZE 400 400
@SLOT 0 120 S01 INPUT STRING 0 1
*/
        for(let row_i=0;row_i<t_script_row_split.length;row_i++)
        {
            if(t_script_row_split[row_i].startsWith("@NODE_SIZE"))
            {
                let t_temp_row_split=t_script_row_split[row_i].split(" ");
                debugger;
                t_width=parseInt(t_temp_row_split[1]);
                t_height=parseInt(t_temp_row_split[2]);
            }
        }

        let l=this.m_MainPage_Runtime.m_Main_Panel.left;
        let t=this.m_MainPage_Runtime.m_Main_Panel.top;
        l=1000-l;
        t=800-t;
        l=l/this.m_MainPage_Runtime.m_Main_Panel.scaleX;
        t=t/this.m_MainPage_Runtime.m_Main_Panel.scaleY;
        let id="NODE"+this.Get_Rand_String();
        this.m_MainPage_Runtime.Add_Functon_Node(
           id ,t_width,t_height,l,t
        );

        this.m_MainPage_Runtime.m_Node_List.get(id).SetNodeName(t_script_row_split[0]);
        this.m_MainPage_Runtime.m_Node_List.get(id).Update_Node();
        for(let row_i=0;row_i<t_script_row_split.length;row_i++)
        {
            if(t_script_row_split[row_i].startsWith("@SLOT"))
            {
                let slot_id="SLOT"+this.Get_Rand_String();
                let t_temp_row_split=t_script_row_split[row_i].split(" ");
                let t_left=parseInt(t_temp_row_split[1]);
                let t_right=parseInt(t_temp_row_split[2]);
                this.m_MainPage_Runtime.Add_Function_Slot(id,slot_id,100,100,t_left,t_right,0);
                let slot:FunctionNodeSlot_Runtime=this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id);
                slot.m_SlotName=t_temp_row_split[3];
                slot.m_SlotType=t_temp_row_split[4];
                slot.m_Param_Type=t_temp_row_split[5];
                slot.m_Param_Value=t_temp_row_split[6];
                slot.m_Orientation=parseInt(t_temp_row_split[7]);
                try{
                    this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id).Update_Slot();
                }catch(e)
                {

                }
            }
        }

    }
    On_Node_Clicked(id:string,instance :FunctionNode_Runtime)
    {
        this.m_MainPage_Runtime.m_Object_ID_Text.text="NODE "+id;
        this.m_Last_Clicked_Node=instance;
        
        let list=this.m_MainPage_Runtime.m_Node_Attributes_List;
     
        var data: Array<Slot_Attribute_Model> = [];
        instance.m_Slot_List.forEach((item:FunctionNodeSlot_Runtime)=>
        {
            let t_item= new Slot_Attribute_Model  (  );
            t_item.m_Node=instance.m_ID;
            t_item.m_Slot=item.m_ID;
            t_item.m_Node_Instance=instance;
            t_item.m_Slot_Instance=item;
            data.push(
                t_item
            );
        });

        list.array = data;

    }
    On_Slot_Clicked(node:string,slot:string,instance :FunctionNodeSlot_Runtime)
    {
        //debugger;
        if(this.m_MainPage_Runtime.m_Slot_Linking_Toggle.toggle)
        {         
            if(this.m_Last_Clicked_Slot==null)
            {
                this.m_Last_Clicked_Slot=instance;
            }else{
                this.m_MainPage_Runtime.Add_Line( "LINE"+this.Get_Rand_String(),
                    this.m_Last_Clicked_Slot.m_Node.m_ID,
                    instance.m_Node.m_ID,
                    this.m_Last_Clicked_Slot.m_ID,
                    instance.m_ID,
                );

                

                this.m_Last_Clicked_Slot=null;
                
                this.m_MainPage_Runtime.m_Main_Panel.event("MAIN_PAGE_REPAINT_LINE");
            }

        }
        this.m_MainPage_Runtime.m_Object_ID_Text.text="SLOT "+node+":"+slot;
    }
    Get_Rand_String():string
    {
        let CharArray:Array<string>=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];    
    
        let res:string="0x";
        for(let i:number=0;i<32;i++)
        {

            let c=Math.random()*3600;
            c=parseInt(c.toFixed(0));
            c=c%36;
            res=res+CharArray[c];
        }
        return res;
    }

}
import Box = Laya.Box;

class Node_Attribute_Item extends Box {
    public static WID: number = 373;
    public static HEI: number = 85;
    private m_Label: Laya.Label;
    private m_Text:Laya.TextInput;
    constructor(){
        super();
        this.size(Node_Attribute_Item.WID, Node_Attribute_Item.HEI);
        this.m_Label = new Laya.Label();
        this.m_Label.x=0;
        this.m_Label.fontSize=48;
        this.addChild(this.m_Label);
        this.m_Text=new Laya.TextInput();
        this.m_Text.y=48;
        this.m_Text.width=120;
        this.m_Text.on(Laya.Event.FOCUS_CHANGE,this,this.On_FocusChange);
        this.m_Text.on(Laya.Event.ENTER,this,this.On_FocusChange);
        this.addChild(this.m_Text);
    }
    public On_FocusChange()
    {
        this.dataSource.m_Slot_Instance.m_Param_Value=this.m_Text.text;
    }
    public Update(src: Slot_Attribute_Model): void {
        this.m_Label.text=src.m_Slot_Instance.m_SlotName;
        this.m_Text.text=src.m_Slot_Instance.m_Param_Value;
    }
}
class Slot_Attribute_Model
{
    m_Node:string;
    m_Slot:string;
    m_Node_Instance:FunctionNode_Runtime;
    m_Slot_Instance:FunctionNodeSlot_Runtime;
}
class Serialization_Node
{
    public m_ID:string;
    public m_X:number;
    public m_Y:number;
    public m_W:number;
    public m_H:number;
    public m_Name:string;
}