import { useDesktopStore } from '../../store/useDesktopStore';
import { startMenuItems, desktopIcons } from '../../data/icons';

export function StartMenu({ onClose }) {
  const openWindow = useDesktopStore((s) => s.openWindow);

  const handleClick = (item) => {
    onClose();
    const def = desktopIcons.find((i) => i.id === item.id);
    if (!def) return;
    if (def.link) {
      window.open(def.link, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow({
      component: def.component,
      title: def.title ?? def.label,
      icon: def.emoji,
      width: def.width,
      height: def.height,
      singleton: def.singleton,
    });
  };

  return (
    <div className="start-menu" onMouseDown={(e) => e.stopPropagation()}>
      <div className="start-menu-sidebar">Aditya 95</div>
      <div className="start-menu-items">
        {startMenuItems.map((item, i) =>
          item.separator ? (
            <div key={`sep-${i}`} className="start-menu-separator" />
          ) : (
            <button
              key={item.id}
              className="start-menu-item"
              onClick={() => handleClick(item)}
            >
              <span className="emoji">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
