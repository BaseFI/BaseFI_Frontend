import FunctionNode_Runtime from "./FunctionNode_Runtime";
import MainPage_Runtime_Toolbar_Init from "./MainPage_Runtime_Toolbar_Init";
import  Function_Line  from "./Function_Line";
import {ui} from "./ui/layaMaxUI"


export default class MainPage_Runtime extends ui.MainPageUI {

    m_Canvas_Sprite:Laya.Sprite;
    m_Node_List:Map<string,FunctionNode_Runtime> =new Map<string,FunctionNode_Runtime>();
    m_Selected_Node_List:Map<string,FunctionNode_Runtime> =new Map<string,FunctionNode_Runtime>();
    m_Line_List:Map<string,Function_Line> =new Map<string,Function_Line>();
    m_Old_Mouse_Point_X:number=0;
    m_Old_Mouse_Point_Y:number=0;
    m_Mouse_Down:boolean =false;

    m_Toolbar_init:MainPage_Runtime_Toolbar_Init;

    constructor() 
    {
        super(); 
        /////////////////////////////////////////////////////////////////////
        this.m_Toolbar_init=new MainPage_Runtime_Toolbar_Init();
        this.m_Toolbar_init.m_MainPage_Runtime=this;
        this.m_Toolbar_init.Init();
        //////////////////////////////////////////////////////////////////////
        this.m_Main_Panel.top=0;
        this.m_Main_Panel.left=0;
        
        this.m_Main_Panel.scale(1,1);
        this.m_Main_Panel.on(Laya.Event.MOUSE_WHEEL,this,this.On_Panel_Mouse_Whell);
        this.m_Main_Panel.on("MAIN_PAGE_REPAINT_LINE",this,this.Repaint_Lines);
        this.m_InjectintButton.on(Laya.Event.CLICK,this,this.Inject);
        this.m_Main_Panel.on(Laya.Event.MOUSE_DOWN,this,this.On_Mouse_Down);
        this.m_Main_Panel.on(Laya.Event.MOUSE_UP,this,this.On_Mouse_Up);
        this.m_Main_Panel.on(Laya.Event.MOUSE_MOVE,this,this.On_Mouse_Move);
    }
    Set_Slot_Attributes(node_id:string,slot_id:string,    
        Orientation:number=0,
        Param_Type:string,
        Param_Value:string,
        SlotType:string)
    {
        let node:FunctionNode_Runtime= this.m_Node_List.get(node_id);
        if(node==null)return;
        let slot=node.m_Slot_List.get(slot_id);
        if(slot==null)return;
        slot.m_Orientation=Orientation;
        slot.m_Param_Type=Param_Type;
        slot.m_Param_Value=Param_Value;
        slot.m_SlotType=SlotType;
    }
    Add_Functon_Node(id:string ,p_width:number,p_heigth:number,p_left:number,p_top:number):void
    {
        let node :FunctionNode_Runtime= new FunctionNode_Runtime();
        node.m_ID=id;
        node.m_Clicked_Callback=function(){  }
        node.m_Main_Page_Panel=this.m_Main_Panel;
        this.m_Node_List.set(id,node);
        this.m_Main_Panel.addChild(node);
        node.x=p_left;
        node.y=p_top;
        node.top=p_top;
        node.left=p_left;
        node.width=p_width;
        node.height=p_heigth;
    }
    Delete_Node(id:string )
    {
        let node:FunctionNode_Runtime= this.m_Node_List.get(id);
        node.m_Slot_List.forEach(element => {
           this.Delete_Slot(node.m_ID,element.m_ID);
        });
        this.m_Main_Panel.removeChild(node);
        this.m_Node_List.delete(id);
    }
    Add_Line(id:string,from_node:string ,to_node:string,from_slot:string,to_slot:string)
    {
        let l :Function_Line=new Function_Line();
        l.m_ID=id;
        l.node_from=from_node;
        l.node_to=to_node;
        l.slot_from=from_slot;
        l.slot_to=to_slot;
        this.m_Line_List.set(id,l);

        let line_exist_from:boolean=false;
        let line_exist_to:boolean=false;
        this.m_Node_List.get(from_node).m_Slot_List.get(from_slot).m_Line_List.forEach(element => {
            if( element.node_to==to_node && element.slot_to==to_slot)
            {
                line_exist_from=true; 
            }
        });
        this.m_Node_List.get(to_node).m_Slot_List.get(to_slot).m_Line_List.forEach(element => {
            if( element.node_from==from_node && element.slot_from==from_slot)
            {
                line_exist_to=true; 
            }
         });
         if((line_exist_from==false) && (line_exist_to==false))
         {
            this.m_Node_List.get(from_node).m_Slot_List.get(from_slot).m_Line_List.set(id,l);
            this.m_Node_List.get(to_node).m_Slot_List.get(to_slot).m_Line_List.set(id,l);
         }
        
    }
    Delete_Slot(node_id:string,slot_id:string)
    {
        let node:FunctionNode_Runtime= this.m_Node_List.get(node_id);
        if(node==null)return;
        let slot=node.m_Slot_List.get(slot_id);
        if(slot==null)return;
        slot.m_Line_List.forEach(element => {
            this.Delete_Line(element.m_ID);
        });
        node.removeChild(slot);
        node.m_Slot_List.delete(slot_id);
    }
    Delete_Line_Of_Slot(node_id:string,slot_id:string)
    {
        let node:FunctionNode_Runtime= this.m_Node_List.get(node_id);
        if(node==null)return;
        let slot=node.m_Slot_List.get(slot_id);
        if(slot==null)return;
        slot.m_Line_List.forEach(element => {
            this.Delete_Line(element.m_ID);
        });
    }
    Delete_Line(id:string)
    {
        let l :Function_Line=this.m_Line_List.get(id);
        if(l==null)return;
        this.m_Node_List.get( l.node_from).m_Slot_List.get( l.slot_from).m_Line_List.delete(id);
        this.m_Node_List.get( l.node_to).m_Slot_List.get( l.slot_to).m_Line_List.delete(id);
        this.m_Line_List.delete(id);
    }
    Add_Function_Slot(node_id:string ,slot_id:string,p_width:number,p_heigth:number,p_left:number,p_top:number,p_orientation:number):void
    {
        this.m_Node_List.get(node_id).Add_Slot(slot_id,p_width,p_heigth,p_left,p_top,p_orientation);
        //console.log( this.m_Node_List.get(node_id));
    }

    On_Panel_Mouse_Whell(e:any)
    {
        let s_x:number=this.m_Main_Panel.scaleX;
        let s_y:number=this.m_Main_Panel.scaleY;
        let s_rate:number=(100.0+e.delta)/100.0;
        s_x=s_x*s_rate;
        s_y=s_x*s_rate;
        let panel_l:number=this.m_Main_Panel.left;
        let panel_t:number=this.m_Main_Panel.top;
        panel_l=panel_l-this.mouseX;
        panel_t=panel_t-this.mouseY;

        panel_l=panel_l*s_rate;
        panel_t=panel_t*s_rate;

        panel_l=panel_l+this.mouseX;
        panel_t=panel_t+this.mouseY;

        this.m_Main_Panel.left=panel_l;
        this.m_Main_Panel.top=panel_t;

        this.m_Main_Panel.scale(s_x,s_y);
        console.log(e);

    }
    onEnable(): void {
        let w:any =window;
        w.MAIN_PAGE=this;
        let sp = new Laya.Sprite();
        this.m_Canvas_Sprite=sp;
        this.m_Main_Panel.addChild(sp);
        this.m_Canvas_Sprite.mouseEnabled=false;
       
        this.m_Canvas_Sprite.graphics.clear();
        this.Add_Functon_Node("C",300,300,100,100);



    }
    Inject()
    {
        this.Add_Functon_Node("A",300,300,100,100);
        this.Add_Functon_Node("B",300,300,300,100);
        this.Add_Function_Slot("A","SLOT0",100,100,100,100,1);
        this.Add_Function_Slot("B","SLOT0",100,100,100,100,2);
        //this.Add_Line("LINE01","A","B","SLOT0","SLOT0");
    }


    On_Mouse_Down(e:any)
    {   //console.log(e);
        
        //console.log("MOUSE");
        let x:number=this.m_Main_Panel.mouseX;
        let y:number=this.m_Main_Panel.mouseY;
        console.log(x+"-"+y)
        this.m_Old_Mouse_Point_X=x;
        this.m_Old_Mouse_Point_Y=y;
        this.m_Mouse_Down=true;
        this.m_Main_Panel.captureMouseEvent(false);
      
    }
    On_Mouse_Up(e:any)
    {   //console.log(e);

        this.m_Mouse_Down=false;
        this.m_Main_Panel.releaseMouseEvent();
    }
    On_Mouse_Move(e:any)
    {   //console.log(e);
        //console.log("MOUSE");
        let x:number=this.m_Main_Panel.mouseX;
        let y:number=this.m_Main_Panel.mouseY;
        //console.log(x+"-"+y)
        if(this.m_Mouse_Down===true)
        {

            let delta_x:number=0;
            let delta_y:number=0;
            delta_x=x-this.m_Old_Mouse_Point_X;
            delta_y=y-this.m_Old_Mouse_Point_Y;
            this.m_Main_Panel.left+=delta_x;
            this.m_Main_Panel.top +=delta_y;
            
        }
    }

    Repaint_Lines():void
    { 
        console.log("REPAINT");
        this.m_Canvas_Sprite.graphics.clear();

        let from_x:number,from_y:number,to_x:number,to_y:number;

        let from_delta_x:number,from_delta_y:number;
        let to_delta_x:number,to_delta_y:number;


        this.m_Line_List.forEach(
            element => {
                from_y=this.m_Node_List.get(element.node_from).top;
                from_x=this.m_Node_List.get(element.node_from).left;
                to_y=this.m_Node_List.get(element.node_to).top;
                to_x=this.m_Node_List.get(element.node_to).left;

                let slot_from=this.m_Node_List.get(element.node_from).m_Slot_List.get(element.slot_from);
                let slot_to=this.m_Node_List.get(element.node_to).m_Slot_List.get(element.slot_to);

                switch (slot_to.m_Orientation)
                {
                    case 0:
                        to_delta_x=0;
                        to_delta_y=-10;
                        break;
                    case 1:
                        to_delta_x=10;
                        to_delta_y=0;
                        break;
                    case 2:
                        to_delta_x=0;
                        to_delta_y=10;
                        break;
                    case 3:
                        to_delta_x=-10;
                        to_delta_y=0;
                        break;
                    default:
                        to_delta_x=0;
                        to_delta_y=0;

                }
                switch (slot_from.m_Orientation)
                {
                    case 0:
                        from_delta_x=0;
                        from_delta_y=-10;
                        break;
                    case 1:
                        from_delta_x=10;
                        from_delta_y=0;
                        break;
                    case 2:
                        from_delta_x=0;
                        from_delta_y=10;
                        break;
                    case 3:
                        from_delta_x=-10;
                        from_delta_y=0;
                        break;
                    default:
                        from_delta_x=0;
                        from_delta_y=0;

                }

                from_delta_y*=10;
                from_delta_x*=10;
                to_delta_y*=10;
                to_delta_x*=10;
                
                let slot_offset_from_x=slot_from.left+slot_from.width/2;
                let slot_offset_from_y=slot_from.top+slot_from.height/2;
                let slot_offset_to_x=slot_to.left+slot_to.width/2;
                let slot_offset_to_y=slot_to.top+slot_to.height/2;
                this.m_Canvas_Sprite.graphics.drawLine(from_x+slot_offset_from_x, from_y+slot_offset_from_y,
    
                     to_x+slot_offset_to_x, to_y+slot_offset_to_y, "#0000ff", 5);
            }
        );

    }



    onDisable(): void {
    }
}