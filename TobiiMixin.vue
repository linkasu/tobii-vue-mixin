<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { TOBIIEVENTS } from "./TobiiEvents";
@Component
export class TobiiAwareElement extends Vue {
  tobii = {
    enterTime: 0,
    exitTime: 0,
    inside: false,
  };
  created() {
    document.addEventListener(TOBIIEVENTS["tobii.point"], (e) => {
      const detail = (e as any).detail as { x: number; y: number; ts: number };
      this.$emit(TOBIIEVENTS["tobii.point"], detail);
      const { x, y, ts } = detail;
      if (this.$el == null || this.$el.getBoundingClientRect == null) {
        return;
      }
      const rect = this.$el.getBoundingClientRect();
      const oldInside = this.tobii.inside;
      const inside =
        x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;

      if (!oldInside && inside) {
        this.tobii.enterTime = ts;
        this.$emit(TOBIIEVENTS["tobii.enter"], ts);
      } else if (oldInside && inside) {
        this.$emit(TOBIIEVENTS["tobii.stay"], ts - this.tobii.enterTime);
      } else if (oldInside && !inside) {
        this.tobii.exitTime = ts;
        this.$emit(TOBIIEVENTS["tobii.out"], ts);
      } else {
        if (this.tobii.exitTime != null && ts - this.tobii.exitTime > 100) {
          this.tobii.exitTime = null;
          this.$emit(TOBIIEVENTS["tobii.longout"], ts);
        }
      }
      this.tobii.inside = inside;
    });
  }
}
</script>