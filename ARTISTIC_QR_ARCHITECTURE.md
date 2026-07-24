# QR Code Functional Patterns

## What CANNOT be modified (must stay as squares):

### Finder Patterns (7x7 squares)
- Top-left: rows 0-6, cols 0-6
- Top-right: rows 0-6, cols (n-7) to (n-1)
- Bottom-left: rows (n-7) to (n-1), cols 0-6

### Timing Patterns (alternating line)
- Horizontal: row 6, cols 8 to (n-9)
- Vertical: col 6, rows 8 to (n-9)

### Alignment Patterns (5x5 squares, position varies by version)
- Position depends on QR version (size)
- Common positions for version 1-7:
  - Version 1: None
  - Version 2: (18, 18)
  - Version 3: (22, 22)
  - etc.

### Format Information (around finder patterns)
- Near finder patterns, specific positions

### Version Information (for version >= 7)
- Near top-right and bottom-left finder patterns

## What CAN be modified (data area):
- Everything else is data modules
- These can have artistic styles

## Implementation Plan:
1. Draw ALL modules as standard squares first
2. Identify which modules are functional
3. Re-draw ONLY data modules with artistic style
4. This ensures scanner always has clear functional patterns

## Proper artistic QR approach:
- Use HIGH error correction (30%)
- Keep functional patterns as squares
- Only modify data modules
- Maintain high contrast
- Ensure 85%+ coverage of each module
