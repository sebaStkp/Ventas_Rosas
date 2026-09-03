/*
  Warnings:

  - You are about to drop the column `ordenId` on the `DetalleOrden` table. All the data in the column will be lost.
  - You are about to drop the column `precioUnitario` on the `DetalleOrden` table. All the data in the column will be lost.
  - You are about to drop the column `varianteId` on the `DetalleOrden` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `lugarEntrega` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VarianteProducto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `DetalleOrden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden_id` to the `DetalleOrden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_unitario` to the `DetalleOrden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lugar_entrega` to the `Orden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `Orden` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetalleOrden" DROP CONSTRAINT "DetalleOrden_ordenId_fkey";

-- DropForeignKey
ALTER TABLE "DetalleOrden" DROP CONSTRAINT "DetalleOrden_varianteId_fkey";

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "VarianteProducto" DROP CONSTRAINT "VarianteProducto_productoId_fkey";

-- AlterTable
ALTER TABLE "DetalleOrden" DROP COLUMN "ordenId",
DROP COLUMN "precioUnitario",
DROP COLUMN "varianteId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "orden_id" TEXT NOT NULL,
ADD COLUMN     "precio_unitario" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "fechaCreacion",
DROP COLUMN "lugarEntrega",
DROP COLUMN "usuarioId",
ADD COLUMN     "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hora_entrega" TIMESTAMP(3),
ADD COLUMN     "lugar_entrega" TEXT NOT NULL,
ADD COLUMN     "usuario_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Producto";

-- DropTable
DROP TABLE "VarianteProducto";

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrden" ADD CONSTRAINT "DetalleOrden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
