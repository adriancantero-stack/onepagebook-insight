-- Add missing RLS policies for book_import_history table

-- Policy for INSERT - only admins
CREATE POLICY "Admins can insert import history"
  ON public.book_import_history
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy for UPDATE - only admins
CREATE POLICY "Admins can update import history"
  ON public.book_import_history
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy for DELETE - only admins
CREATE POLICY "Admins can delete import history"
  ON public.book_import_history
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));