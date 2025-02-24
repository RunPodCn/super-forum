<div class="wrapper sticky-top">
    <div class="navbar-expand-md">
        <div class="collapse navbar-collapse" id="navbar-menu">
            <div class="navbar navbar-light">
                <div class="container-xl">
                    @include('Core::layouts.themes.menu')
                    @include('Core::layouts.themes.search')
                </div>
            </div>
        </div>
    </div>
    <header class="navbar navbar-expand-md navbar-light d-print-none">
        <div class="container-xl">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                <a href="/">{{ get_options('web_name', 'CodeFec') }}</a>
            </h1>
            <div class="flex-row navbar-nav order-md-last">
                @include('Core::layouts.themes.header-right')
            </div>
        </div>
    </header>
</div>
