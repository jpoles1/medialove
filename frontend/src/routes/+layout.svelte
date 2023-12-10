<script>
  import '../app.css';

	import { AppBar, AppLayout } from "svelte-ux";
	import Header from "./Header.svelte";
</script>

<AppLayout>
    <nav slot="nav" class="h-full bg-content text-contenttext">
      <!-- Nav menu -->
    </nav>
  
    <AppBar class="bg-base text-basetext">
      <div slot="title">
        <a href="/">MediaLove</a>
      </div>
      <div slot="actions">
        <!-- App actions -->
      </div>
    </AppBar>
    <main class="text-contenttext p-2">
      <slot />
    </main>
  </AppLayout>