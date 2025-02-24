import Vditor from 'vditor';
import axios from "axios";
import iziToast from "izitoast";
const qs = require('querystring')
import copy from 'copy-to-clipboard';
import Swal from "sweetalert2";

if(document.getElementById("create-topic-vue")){
    const create_topic_vue = {
        data(){
            return {
                vditor: '',
                title:localStorage.getItem("topic_create_title"),
                edit:{
                    mode:"ir",
                    preview:{
                        mode:"editor"
                    }
                },
                options:{
                    summary:'',
                    hidden:{
                        type:"close",
                        user:{
                            list:[

                            ],
                            selected:null
                        },
                        user_class:[]
                    }
                },
                tag_selected:1,
                tags:[
                    {"text":"请选择","value":"Default","icons":"1"}
                ],
                userAtList:[

                ],
                topic_keywords:[

                ],
            }
        },

        methods:{
            edit_reply(){
                const md = this.vditor.getSelection();
                this.vditor.updateValue("[reply]"+md+"[/reply]")
            },
            edit_mode(){
              if(this.edit.mode==="ir"){
                  this.edit.mode="wysiwyg"
                  this.init()
              }else{
                  if(this.edit.mode==="wysiwyg"){
                      this.edit.mode="sv"
                      this.edit.preview.mode="editor";
                      this.init()
                  }else{
                      if(this.edit.mode==="sv"){
                          if(this.edit.preview.mode==="editor"){
                              this.edit.mode="sv"
                              this.edit.preview.mode="both";
                              this.init()
                          }else{
                              if(this.edit.preview.mode==="both"){
                                  this.edit.mode="ir"
                                  this.edit.preview.mode="editor";
                                  this.init()
                              }
                          }
                      }
                  }
              }

                iziToast.show({
                    title: 'success',
                    message: '切换成功!',
                    color: "#63ed7a",
                    position: 'topRight',
                    messageColor : '#ffffff',
                    titleColor : '#ffffff'
                });

            },
            submit(){
                const options_hidden_user_list = qs.stringify(this.options.hidden.user.list)
                const options_hidden_user_class = qs.stringify(this.options.hidden.user_class)
                const options_hidden_type = this.options.hidden.type
                const html = this.vditor.getHTML();
                const markdown = this.vditor.getValue();
                const tags = this.tag_selected;
                const title = this.title;
                const summary = this.options.summary
                if(!title){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '标题不能为空',
                    });
                    return;

                }
                if(!html || !markdown){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '正文内容不能为空',
                    });
                    return;

                }
                axios.post("/topic/create",{
                    _token:csrf_token,
                    options_hidden_user_list:options_hidden_user_list,
                    options_hidden_user_class:options_hidden_user_class,
                    options_hidden_type:options_hidden_type,
                    title:this.title,
                    html:html,
                    markdown:markdown,
                    tag:tags,
                    options_summary: summary
                })
                    .then(r=>{
                        const data = r.data;
                        if(!data.success){
                            data.result.forEach(function(value){
                                iziToast.error({
                                    title:"error",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                        }else{
                            localStorage.removeItem("topic_create_title")
                            localStorage.removeItem("topic_create_tag")
                            this.vditor.clearCache()
                            data.result.forEach(function(value){
                                iziToast.success({
                                    title:"success",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                            setTimeout(function(){
                                location.href="/"
                            },2000)
                        }
                    })
                    .catch(e=>{
                        console.error(e)
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: '请求出错,详细查看控制台',
                        });
                    })
            },
            // 存为草稿
            draft(){
                const options_hidden_user_list = qs.stringify(this.options.hidden.user.list)
                const options_hidden_user_class = qs.stringify(this.options.hidden.user_class)
                const options_hidden_type = this.options.hidden.type
                const html = this.vditor.getHTML();
                const markdown = this.vditor.getValue();
                const tags = this.tag_selected;
                const title = this.title;
                const summary = this.options.summary
                if(!title){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '标题不能为空',
                    });
                    return;

                }
                if(!html || !markdown){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '正文内容不能为空',
                    });
                    return;

                }
                axios.post("/topic/create/draft",{
                    _token:csrf_token,
                    options_hidden_user_list:options_hidden_user_list,
                    options_hidden_user_class:options_hidden_user_class,
                    options_hidden_type:options_hidden_type,
                    title:this.title,
                    html:html,
                    markdown:markdown,
                    tag:tags,
                    options_summary: summary
                })
                    .then(r=>{
                        const data = r.data;
                        if(!data.success){
                            data.result.forEach(function(value){
                                iziToast.error({
                                    title:"error",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                        }else{
                            localStorage.removeItem("topic_create_title")
                            localStorage.removeItem("topic_create_tag")
                            this.vditor.clearCache()
                            data.result.forEach(function(value){
                                iziToast.success({
                                    title:"success",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                            setTimeout(function(){
                                location.href="/"
                            },2000)
                        }
                    })
                    .catch(e=>{
                        console.error(e)
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: '请求出错,详细查看控制台',
                        });
                    })
            },
            // 帖子引用
            edit_with_topic(){
                swal("输入帖子id或帖子链接:", {
                    content: "input",
                })
                    .then((value) => {
                        if(value){
                            let id;
                            if(!(/(^[1-9]\d*$)/.test(value))){
                                value = value.match(/\/(\S*)\.html/);
                                if(value){
                                    value = value[1];
                                }else{
                                    return ;
                                }
                                id = value.substring(value.lastIndexOf("/")+1);
                            }else{
                                id = value
                            }
                            const md = this.vditor.getSelection();
                            copy('[topic='+id+']'+md+'[/topic]')
                            iziToast.success({
                                title:"Success",
                                message:"短代码已复制,请在合适位置粘贴",
                                position:"topRight"
                            })
                        }
                    });
            },

            async edit_with_files() {
                const {value: formValues} = await Swal.fire({
                    title: '添加附件',
                    html:
                        '<label class="form-label">附件名 <b style="color:red">*</b></label> <input id="add-files-name" placeholder="附件名称" required class="swal-content__input">' +
                        '<label class="form-label">下载链接 <b style="color:red">*</b></label> <input id="add-files-url" placeholder="下载链接" required class="swal-content__input">' +
                        '<label class="form-label">下载密码</label><input id="add-files-pwd" placeholder="下载密码" class="swal-content__input">' +
                        '<label class="form-label">解压密码</label><input id="add-files-unzip-pwd" placeholder="解压密码" class="swal-content__input">',
                    focusConfirm: false,
                    preConfirm: () => {
                        return {
                            name:document.getElementById('add-files-name').value,
                            url:document.getElementById('add-files-url').value,
                            pwd:document.getElementById('add-files-pwd').value,
                            unzip:document.getElementById('add-files-unzip-pwd').value
                        }
                    }
                })

                if (formValues) {
                    if(!formValues.name){
                        await Swal.fire({
                            title: "附件名称不能为空!",
                            icon: "error",
                        })
                        return ;
                    }
                    if(!formValues.url){
                        await Swal.fire({
                            title: "附件链接不能为空!",
                            icon: "error",
                        })
                        return ;
                    }
                    const md = this.vditor.getSelection();
                    copy('[file='+formValues.name+','+formValues.url+','+formValues.pwd+','+formValues.unzip+']'+md+'[/file]')
                    iziToast.success({
                        title:"Success",
                        message:"短代码已复制,请在合适位置粘贴",
                        position:"topRight"
                    })
                }

            },

            edit_toc(){
                const md = this.vditor.getValue();
                this.vditor.setValue("[toc]\n"+md)
            },
            init(){
                // tags

                axios.post("/api/topic/tags",{_token:csrf_token})
                    .then(response => {
                        this.tags = response.data
                    })
                    .catch(e=>{
                        console.error(e)
                    })

                // vditor
                this.vditor = new Vditor('content-vditor', {
                    height: 400,
                    toolbarConfig: {
                        pin: true,
                    },
                    cache: {
                        enable: true,
                        id: "create_topic"
                    },
                    preview: {
                        markdown: {
                            toc: true,
                            mark: true,
                            autoSpace: true
                        }
                    },
                    mode: this.edit.mode,
                    toolbar: [
                        "emoji",
                        "headings",
                        "bold",
                        "italic",
                        "strike",
                        "link",
                        "|",
                        "list",
                        "ordered-list",
                        "outdent",
                        "indent",
                        "|",
                        "quote",
                        "line",
                        "code",
                        "inline-code",
                        "insert-before",
                        "insert-after",
                        "|",
                        "upload",
                        "record",
                        "table",
                        "|",
                        "undo",
                        "redo",
                        "|",
                        "fullscreen",
                        "edit-mode",

                    ],
                    counter: {
                        "enable": true,
                        "type": "已写字数"
                    },
                    hint: {
                        extend: [
                            {
                                key: '@',
                                hint: (key) => {
                                    return this.userAtList
                                },
                            },
                            {
                                key: '$',
                                hint: (key) => {
                                    return this.topic_keywords
                                },
                            }],
                    },
                    upload: {
                        accept: 'image/*,.wav',
                        token: csrf_token,
                        url: imageUpUrl,
                        linkToImgUrl: imageUpUrl,
                        filename(name) {
                            return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
                            replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
                            replace('/\\s/g', '')
                        },
                    },

                    typewriterMode: true,
                    placeholder: "请输入正文",
                    after: () => {
                        axios.post("/api/user/@user_list",{_token:csrf_token})
                            .then(r=>{
                                this.userAtList =  r.data;
                            })
                            .catch(e=>{
                                swal({
                                    title:"获取本站用户列表失败,详细查看控制台",
                                    icon:"error"
                                })
                                console.error(e)
                            })
                        axios.post("/api/topic/keywords",{_token:csrf_token})
                            .then(r=>{
                                this.topic_keywords =  r.data;
                            })
                            .catch(e=>{
                                swal({
                                    title:"获取话题列表失败,详细查看控制台",
                                    icon:"error"
                                })
                                console.error(e)
                            })


                    },
                    input(md){

                    },
                    select:(md) => {

                        // 回复可见
                        swal({
                            title:"你选中了一段文字",
                            text:"是否将选中的文字设为回复可见?",
                            buttons:true,
                            icon:"warning"
                        }).then(click=>{
                            if(click){
                                this.vditor.updateValue("[reply]"+md+"[/reply]")
                            }else{
                                this.vditor.focus()
                            }
                        })
                    }
                });
            },
            hidden_user_remove(username){
                this.options.hidden.user.list.splice(this.options.hidden.user.list.indexOf(username),1)
                iziToast.success({
                    title:"Success",
                    message:"已将 "+username+" 从可见列表中移除",
                    position: 'topRight',
                })
            },
            hidden_user_add(){
                const username = this.options.hidden.user.selected;

                if(this.options.hidden.user.list.indexOf(username)===-1){
                    axios.post("/api/user/@has_user_username/"+username,{_token:csrf_token})
                        .then(r=>{
                            const data = r.data;
                            if(data.success){
                                this.options.hidden.user.list.push(username)
                                this.options.hidden.user.selected = null;
                            }else{
                                swal({
                                    title:"新增用户失败,原因:"+data.result.msg,
                                    icon:"error"
                                })
                            }
                        })
                        .catch(e=>{
                            swal({
                                title:"接口请求失败,详细查看控制台",
                                icon:"error"
                            })
                            console.error(e)
                        })
                }else{
                    swal("用户:"+username+"已存在,无需重复添加")
                }
            },

        },

        mounted () {
            if(localStorage.getItem("topic_create_tag")){
                this.tag_selected = localStorage.getItem("topic_create_tag");
            }
            if(localStorage.getItem("topic_create_tag") || localStorage.getItem("topic_create_title")){
                iziToast.info({
                    title:"Info",
                    message:"已为您恢复上次编辑内容",
                    position: 'topRight',
                })
            }
            this.init()

        },
        watch:{
            title:(title=>{
                localStorage.setItem("topic_create_title",title)
            }),
            tag_selected:(tag=>{
                localStorage.setItem("topic_create_tag",tag)
            })
        }
    }
    Vue.createApp(create_topic_vue).mount("#create-topic-vue");
}


if(document.getElementById("topic-content")){
    const previewElement = document.getElementById("topic-content");
    Vditor.mermaidRender(previewElement);
    Vditor.abcRender(previewElement);
    Vditor.chartRender(previewElement);
    Vditor.mindmapRender(previewElement);
    Vditor.graphvizRender(previewElement)
    Vditor.mathRender(previewElement);
    Vditor.mediaRender(previewElement);
    Vditor.highlightRender({ lineNumber: true, enable: true }, previewElement);
    Vditor.flowchartRender(previewElement);
    Vditor.plantumlRender(previewElement);
}



// 编辑帖子
if(document.getElementById("edit-topic-vue")){
    const edit_topic_vue = {
        data(){
            return {
                topic_id:topic_id,
                vditor: '',
                title:'',
                edit:{
                    mode:"ir",
                    preview:{
                        mode:"editor"
                    }
                },
                options:{
                    summary:'',
                    hidden:{
                        type:"close",
                        user:{
                            list:[

                            ],
                            selected:null
                        },
                        user_class:[]
                    }
                },
                tag_selected:1,
                tags:[
                    {"text":"请选择","value":"Default","icons":"1"}
                ],
                userAtList:[

                ],
                topic_keywords:[

                ],
            }
        },

        methods:{
            edit_reply(){
                const md = this.vditor.getSelection();
                this.vditor.updateValue("[reply]"+md+"[/reply]")
            },
            async edit_with_files() {
                const {value: formValues} = await Swal.fire({
                    title: '添加附件',
                    html:
                        '<label class="form-label">附件名 <b style="color:red">*</b></label> <input id="add-files-name" placeholder="附件名称" required class="swal-content__input">' +
                        '<label class="form-label">下载链接 <b style="color:red">*</b></label> <input id="add-files-url" placeholder="下载链接" required class="swal-content__input">' +
                        '<label class="form-label">下载密码</label><input id="add-files-pwd" placeholder="下载密码" class="swal-content__input">' +
                        '<label class="form-label">解压密码</label><input id="add-files-unzip-pwd" placeholder="解压密码" class="swal-content__input">',
                    focusConfirm: false,
                    preConfirm: () => {
                        return {
                            name:document.getElementById('add-files-name').value,
                            url:document.getElementById('add-files-url').value,
                            pwd:document.getElementById('add-files-pwd').value,
                            unzip:document.getElementById('add-files-unzip-pwd').value
                        }
                    }
                })

                if (formValues) {
                    if(!formValues.name){
                        await Swal.fire({
                            title: "附件名称不能为空!",
                            icon: "error",
                        })
                        return ;
                    }
                    if(!formValues.url){
                        await Swal.fire({
                            title: "附件链接不能为空!",
                            icon: "error",
                        })
                        return ;
                    }
                    const md = this.vditor.getSelection();
                    copy('[file='+formValues.name+','+formValues.url+','+formValues.pwd+','+formValues.unzip+']'+md+'[/file]')
                    iziToast.success({
                        title:"Success",
                        message:"短代码已复制,请在合适位置粘贴",
                        position:"topRight"
                    })
                }

            },
            edit_mode(){
                if(this.edit.mode==="ir"){
                    this.edit.mode="wysiwyg"
                    this.init()
                }else{
                    if(this.edit.mode==="wysiwyg"){
                        this.edit.mode="sv"
                        this.edit.preview.mode="editor";
                        this.init()
                    }else{
                        if(this.edit.mode==="sv"){
                            if(this.edit.preview.mode==="editor"){
                                this.edit.mode="sv"
                                this.edit.preview.mode="both";
                                this.init()
                            }else{
                                if(this.edit.preview.mode==="both"){
                                    this.edit.mode="ir"
                                    this.edit.preview.mode="editor";
                                    this.init()
                                }
                            }
                        }
                    }
                }

                iziToast.show({
                    title: 'success',
                    message: '切换成功!',
                    color: "#63ed7a",
                    position: 'topRight',
                    messageColor : '#ffffff',
                    titleColor : '#ffffff'
                });

            },
            submit(){
                const options_hidden_user_list = qs.stringify(this.options.hidden.user.list)
                const options_hidden_user_class = qs.stringify(this.options.hidden.user_class)
                const options_hidden_type = this.options.hidden.type
                const html = this.vditor.getHTML();
                const markdown = this.vditor.getValue();
                const tags = this.tag_selected;
                const title = this.title;
                const summary = this.options.summary
                if(!title){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '标题不能为空',
                    });
                    return;

                }
                if(!html || !markdown){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '正文内容不能为空',
                    });
                    return;

                }
                axios.post("/topic/edit",{
                    _token:csrf_token,
                    topic_id:this.topic_id,
                    options_hidden_user_list:options_hidden_user_list,
                    options_hidden_user_class:options_hidden_user_class,
                    options_hidden_tfixTermTypoype:options_hidden_type,
                    title:this.title,
                    html:html,
                    markdown:markdown,
                    tag:tags,
                    options_summary: summary
                })
                    .then(r=>{
                        const data = r.data;
                        if(!data.success){
                            data.result.forEach(function(value){
                                iziToast.error({
                                    title:"error",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                        }else{
                            this.vditor.clearCache()
                            data.result.forEach(function(value){
                                iziToast.success({
                                    title:"success",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                            setTimeout(function(){
                                location.href="/"+this.topic_id+".html"
                            },2000)
                        }
                    })
                    .catch(e=>{
                        console.error(e)
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: '请求出错,详细查看控制台',
                        });
                    })
            },

            // 存为草稿
            draft(){
                const options_hidden_user_list = qs.stringify(this.options.hidden.user.list)
                const options_hidden_user_class = qs.stringify(this.options.hidden.user_class)
                const options_hidden_type = this.options.hidden.type
                const html = this.vditor.getHTML();
                const markdown = this.vditor.getValue();
                const tags = this.tag_selected;
                const title = this.title;
                const summary = this.options.summary
                if(!title){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '标题不能为空',
                    });
                    return;

                }
                if(!html || !markdown){
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '正文内容不能为空',
                    });
                    return;

                }
                axios.post("/topic/edit/draft",{
                    _token:csrf_token,
                    topic_id:this.topic_id,
                    options_hidden_user_list:options_hidden_user_list,
                    options_hidden_user_class:options_hidden_user_class,
                    options_hidden_tfixTermTypoype:options_hidden_type,
                    title:this.title,
                    html:html,
                    markdown:markdown,
                    tag:tags,
                    options_summary: summary
                })
                    .then(r=>{
                        const data = r.data;
                        if(!data.success){
                            data.result.forEach(function(value){
                                iziToast.error({
                                    title:"error",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                        }else{
                            this.vditor.clearCache()
                            data.result.forEach(function(value){
                                iziToast.success({
                                    title:"success",
                                    message:value,
                                    position:"topRight",
                                    timeout:10000
                                })
                            })
                            setTimeout(function(){
                                location.href="/user/draft"
                            },2000)
                        }
                    })
                    .catch(e=>{
                        console.error(e)
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: '请求出错,详细查看控制台',
                        });
                    })
            },
            // 帖子引用
            edit_with_topic(){
                swal("输入帖子id或帖子链接:", {
                    content: "input",
                })
                    .then((value) => {
                        if(value){
                            let id;
                            if(!(/(^[1-9]\d*$)/.test(value))){
                                value = value.match(/\/(\S*)\.html/);
                                if(value){
                                    value = value[1];
                                }else{
                                    return ;
                                }
                                id = value.substring(value.lastIndexOf("/")+1);
                            }else{
                                id = value
                            }
                            const md = this.vditor.getSelection();
                            copy('[topic='+id+']'+md+'[/topic]')
                            iziToast.success({
                                title:"Success",
                                message:"短代码已复制,请在合适位置粘贴",
                                position:"topRight"
                            })
                        }
                    });
            },
            edit_toc(){
                const md = this.vditor.getValue();
                this.vditor.setValue("[toc]\n"+md)
            },
            init(){
                // tags

                axios.post("/api/topic/tags",{_token:csrf_token})
                    .then(response => {
                        this.tags = response.data
                    })
                    .catch(e=>{
                        console.error(e)
                    })

                // vditor
                this.vditor = new Vditor('content-vditor', {
                    height: 400,
                    toolbarConfig: {
                        pin: true,
                    },
                    cache: {
                        enable: false,
                    },
                    preview: {
                        markdown: {
                            toc: true,
                            mark: true,
                            autoSpace: true
                        }
                    },
                    mode: this.edit.mode,
                    toolbar: [
                        "emoji",
                        "headings",
                        "bold",
                        "italic",
                        "strike",
                        "link",
                        "|",
                        "list",
                        "ordered-list",
                        "outdent",
                        "indent",
                        "|",
                        "quote",
                        "line",
                        "code",
                        "inline-code",
                        "insert-before",
                        "insert-after",
                        "|",
                        "upload",
                        "record",
                        "table",
                        "|",
                        "undo",
                        "redo",
                        "|",
                        "fullscreen",
                        "edit-mode",

                    ],
                    counter: {
                        "enable": true,
                        "type": "已写字数"
                    },
                    hint: {
                        extend: [
                            {
                                key: '@',
                                hint: (key) => {
                                    return this.userAtList
                                },
                            },
                            {
                                key: '$',
                                hint: (key) => {
                                    return this.topic_keywords
                                },
                            }],
                    },
                    upload: {
                        accept: 'image/*,.wav',
                        token: csrf_token,
                        url: imageUpUrl,
                        linkToImgUrl: imageUpUrl,
                        filename(name) {
                            return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
                            replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
                            replace('/\\s/g', '')
                        },
                    },

                    typewriterMode: true,
                    placeholder: "请输入正文",
                    after: () => {
                        axios.post("/api/user/@user_list",{_token:csrf_token})
                            .then(r=>{
                                this.userAtList =  r.data;
                            })
                            .catch(e=>{
                                swal({
                                    title:"获取本站用户列表失败,详细查看控制台",
                                    icon:"error"
                                })
                                console.error(e)
                            })
                        axios.post("/api/topic/keywords",{_token:csrf_token})
                            .then(r=>{
                                this.topic_keywords =  r.data;
                            })
                            .catch(e=>{
                                swal({
                                    title:"获取话题列表失败,详细查看控制台",
                                    icon:"error"
                                })
                                console.error(e)
                            })
                        axios.post("/api/topic/topic.data",{
                            _token:csrf_token,
                            topic_id:this.topic_id
                        }).then(r=>{
                            const data = r.data
                            if(!data.success){
                                iziToast.error({
                                    title: 'Error',
                                    position: 'topRight',
                                    message: data.result.msg,
                                });
                            }else{
                                this.setTopicValue(data.result)
                            }
                        }).catch(e=>{
                            console.error(e)
                            iziToast.error({
                                title: 'Error',
                                position: 'topRight',
                                message: '请求出错,详细查看控制台',
                            });
                        })
                    },
                    input(md){

                    },
                    select:(md) => {

                        // 回复可见
                        swal({
                            title:"你选中了一段文字",
                            text:"是否将选中的文字设为回复可见?",
                            buttons:true,
                            icon:"warning"
                        }).then(click=>{
                            if(click){
                                this.vditor.updateValue("[reply]"+md+"[/reply]")
                            }else{
                                this.vditor.focus()
                            }
                        })
                    }
                });
            },
            hidden_user_remove(username){
                this.options.hidden.user.list.splice(this.options.hidden.user.list.indexOf(username),1)
                iziToast.success({
                    title:"Success",
                    message:"已将 "+username+" 从可见列表中移除",
                    position: 'topRight',
                })
            },
            hidden_user_add(){
                const username = this.options.hidden.user.selected;

                if(this.options.hidden.user.list.indexOf(username)===-1){
                    axios.post("/api/user/@has_user_username/"+username,{_token:csrf_token})
                        .then(r=>{
                            const data = r.data;
                            if(data.success){
                                this.options.hidden.user.list.push(username)
                                this.options.hidden.user.selected = null;
                            }else{
                                swal({
                                    title:"新增用户失败,原因:"+data.result.msg,
                                    icon:"error"
                                })
                            }
                        })
                        .catch(e=>{
                            swal({
                                title:"接口请求失败,详细查看控制台",
                                icon:"error"
                            })
                            console.error(e)
                        })
                }else{
                    swal("用户:"+username+"已存在,无需重复添加")
                }
            },

            setTopicValue(data){
                this.title = data.title
                this.vditor.setValue(data.markdown)
                this.tag_selected = data.tag.id
                this.options.summary = data.options.summary
                this.options.hidden.type = data.options.hidden.type
                this.options.hidden.user.list = data.options.hidden.users
                this.options.hidden.user_class = data.options.hidden.user_class
            }

        },

        mounted () {

            this.init()


        },
        watch:{
            title:(title=>{

            }),
            tag_selected:(tag=>{

            })
        }
    }
    Vue.createApp(edit_topic_vue).mount("#edit-topic-vue");
}



// 对帖子页面的操作
$(function(){

    // 精华
    $('a[core-click="topic-essence"]').click(function(){
        var topic_id = $(this).attr("topic-id");
        swal({
            title:"精华指数,数字越大排名越靠前",
            content: {
                element: "input",
                attributes: {
                    type: "number",
                    max:999,
                    min:1
                },
            },
        }).then(r => {
            if(r && !isNaN(r) && r>=0){
                axios.post("/api/topic/set.topic.essence",{
                    _token:csrf_token,
                    topic_id:topic_id,
                    zhishu:r
                }).then(r=>{
                    const data = r.data;
                    if(data.success){
                        iziToast.success({
                            title: 'Success',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }else{
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }
                }).catch(e=>{
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '请求出错,详细查看控制台',
                    });
                    console.error(e)
                })
            }
        });
    })

    // 置顶
    $('a[core-click="topic-topping"]').click(function(){
        var topic_id = $(this).attr("topic-id");
        swal({
            title:"置顶指数,数字越大排名越靠前",
            content: {
                element: "input",
                attributes: {
                    type: "number",
                    max:999,
                    min:1
                },
            },
        }).then(r => {
            if(r && !isNaN(r) && r>=0){
                axios.post("/api/topic/set.topic.topping",{
                    _token:csrf_token,
                    topic_id:topic_id,
                    zhishu:r
                }).then(r=>{
                    const data = r.data;
                    if(data.success){
                        iziToast.success({
                            title: 'Success',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }else{
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }
                }).catch(e=>{
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '请求出错,详细查看控制台',
                    });
                    console.error(e)
                })
            }
        });
    })

    // 删除
    $('a[core-click="topic-delete"]').click(function(){
        var topic_id = $(this).attr("topic-id");
        swal({
            title:"确定要删除此贴吗? 删除后不可恢复",
            buttons: ["取消", "确定"],
        }).then(r => {
            if(r===true){
                axios.post("/api/topic/set.topic.delete",{
                    _token:csrf_token,
                    topic_id:topic_id,
                    zhishu:r
                }).then(r=>{
                    const data = r.data;
                    if(data.success){
                        iziToast.success({
                            title: 'Success',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }else{
                        iziToast.error({
                            title: 'Error',
                            position: 'topRight',
                            message: data.result.msg,
                        });
                    }
                }).catch(e=>{
                    iziToast.error({
                        title: 'Error',
                        position: 'topRight',
                        message: '请求出错,详细查看控制台',
                    });
                    console.error(e)
                })
            }
        });
    })
})
